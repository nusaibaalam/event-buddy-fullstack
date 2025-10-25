import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  eventId!: string;

  @IsInt()
  @Min(1, { message: 'You must book at least 1 seat.' })
  @Max(4, { message: 'You cannot book more than 4 seats.' })
  seats!: number;
}
