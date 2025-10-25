import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  list(status?: 'upcoming' | 'past') {
    const now = new Date();
    return this.prisma.event.findMany({
      where:
        status === 'upcoming'
          ? { date: { gte: now } }
          : status === 'past'
            ? { date: { lt: now } }
            : undefined,
      orderBy: { date: 'asc' },
      include: { bookings: { select: { seats: true } } },
    });
  }

  async get(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { bookings: { select: { seats: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
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

    // If capacity is being lowered, ensure it’s not below seats already booked
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

    // (Optional) prevent setting date in the past
    if (dto.date) {
      const newDate = new Date(dto.date);
      if (newDate < new Date()) {
        throw new BadRequestException('Event date cannot be in the past.');
      }
    }

    return this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
        tags: dto.tags, // JSON array
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.event.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Event not found');
    return this.prisma.event.delete({ where: { id } });
  }
}
