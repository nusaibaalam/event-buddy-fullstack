import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString() eventId: string;
  @IsInt() @Min(1) @Max(4) seats: number;
}
