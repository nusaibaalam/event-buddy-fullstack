import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ListEventsDto } from './dto/list-events.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: ListEventsDto) {
    const now = new Date();

    const where: any = {};

    // status filter
    if (dto?.status === 'upcoming') {
      where.date = { gte: now };
    } else if (dto?.status === 'past') {
      where.date = { lt: now };
    }

    if (dto?.q && dto.q.trim()) {
      const q = dto.q.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { location: { contains: q } },
      ];
    }

    // ORDER BY
    const orderBy =
      dto?.sort === 'date_desc'
        ? { date: 'desc' as const }
        : { date: 'asc' as const };

    // PAGINATION
    const page = dto?.page ?? 1;
    const pageSize = dto?.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const total = await this.prisma.event.count({ where });

    const events = await this.prisma.event.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        bookings: { select: { seats: true } },
      },
    });

    const items = events.map((e) => {
      const seatsTaken = e.bookings.reduce((sum, b) => sum + b.seats, 0);
      const seatsLeft = e.capacity - seatsTaken;
      const { bookings, ...rest } = e;
      return { ...rest, seatsLeft };
    });

    return {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      items,
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { bookings: { select: { seats: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');
    const seatsTaken = event.bookings.reduce((sum, b) => sum + b.seats, 0);
    const seatsLeft = Math.max(0, event.capacity - seatsTaken);

    const { bookings, ...rest } = event;
    return { ...rest, seatsLeft };
  }

  create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        date: new Date(dto.date),
        capacity: dto.capacity,
        imageUrl: dto.imageUrl,

        tags: dto.tags ?? [],
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    const exists = await this.prisma.event.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Event not found');

    // Ensure capacity is not reduced below already-booked seats
    if (dto.capacity !== undefined) {
      const agg = await this.prisma.booking.aggregate({
        where: { eventId: id },
        _sum: { seats: true },
      });
      const booked = agg._sum.seats ?? 0;
      if (dto.capacity < booked) {
        throw new BadRequestException(
          `Capacity cannot be less than already booked seats (${booked}).`,
        );
      }
    }

    if (dto.date) {
      const newDate = new Date(dto.date);
      if (newDate < new Date()) {
        throw new BadRequestException('Event date cannot be in the past.');
      }
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        location: dto.location,
        date: dto.date ? new Date(dto.date) : undefined,
        capacity: dto.capacity,
        imageUrl: dto.imageUrl,
        tags: dto.tags, // JSON array
      },
    });
  }

  async delete(id: string) {
    const exists = await this.prisma.event.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Event not found');
    return this.prisma.event.delete({ where: { id } });
  }
}
