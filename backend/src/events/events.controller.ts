import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  // PUBLIC: list events (status = upcoming | past | undefined)
  @Get()
  list(@Query('status') status?: 'upcoming' | 'past') {
    return this.events.list(status);
  }

  // PUBLIC: get event details
  @Get(':id')
  get(@Param('id') id: string) {
    return this.events.get(id);
  }

  // ADMIN: create event
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.events.create(dto);
  }

  // ADMIN: update event
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.events.update(id, dto);
  }

  // ADMIN: delete event
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.events.remove(id);
  }
}
