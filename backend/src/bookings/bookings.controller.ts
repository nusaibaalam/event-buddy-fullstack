import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('bookings') // /bookings
@UseGuards(JwtAuthGuard) // all routes require auth
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  // POST /bookings
  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user.id, dto);
  }

  @Get('me')
  async getMyBookings(@CurrentUser() user: any) {
    return this.bookings.findMyBookings(user.id);
  }

  // DELETE /bookings/:id  (user can delete their own)
  @Delete(':id')
  cancel(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookings.cancel(user.id, id);
  }

  // DELETE /bookings/admin/:id  (ADMIN ONLY — delete anyone's)
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/:id')
  cancelAsAdmin(@Param('id') id: string) {
    return this.bookings.cancelAsAdmin(id);
  }
}
