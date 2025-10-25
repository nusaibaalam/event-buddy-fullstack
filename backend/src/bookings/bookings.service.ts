import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const now = new Date();

    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
      select: { id: true, date: true, capacity: true },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.date <= now) {
      throw new BadRequestException(
        'Booking not allowed: event date has passed',
      );
    }

    // current remaining (outside of tx for fast fail)
    const agg = await this.prisma.booking.aggregate({
      where: { eventId: dto.eventId },
      _sum: { seats: true },
    });
    const taken = agg._sum.seats ?? 0;
    const remaining = event.capacity - taken;

    if (dto.seats > remaining) {
      throw new BadRequestException(`Only ${remaining} seats left`);
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // re-check inside tx (race-safe)
        const agg2 = await tx.booking.aggregate({
          where: { eventId: dto.eventId },
          _sum: { seats: true },
        });
        const taken2 = agg2._sum.seats ?? 0;
        const remaining2 = event.capacity - taken2;
        if (dto.seats > remaining2) {
          throw new BadRequestException(`Only ${remaining2} seats left`);
        }

        const booking = await tx.booking.create({
          data: { userId, eventId: dto.eventId, seats: dto.seats },
        });

        const afterAgg = await tx.booking.aggregate({
          where: { eventId: dto.eventId },
          _sum: { seats: true },
        });
        const takenAfter = afterAgg._sum.seats ?? 0;
        const availableSpots = event.capacity - takenAfter;

        return { booking, availableSpots };
      });

      // return booking plus the new availability
      return {
        ...result.booking,
        availableSpots: result.availableSpots,
      };
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new BadRequestException('You already booked this event');
      }
      throw e;
    }
  }

  async findMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancel(userId: string, bookingId: string) {
    const b = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!b) throw new NotFoundException('Booking not found');
    if (b.userId !== userId) throw new ForbiddenException('Not your booking');
    return this.prisma.booking.delete({ where: { id: bookingId } });
  }

  // ADMIN: cancel any booking
  async cancelAsAdmin(bookingId: string) {
    const b = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!b) throw new NotFoundException('Booking not found');
    return this.prisma.booking.delete({ where: { id: bookingId } });
  }
}
