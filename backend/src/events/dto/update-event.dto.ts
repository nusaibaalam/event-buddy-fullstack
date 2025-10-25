import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import {
  IsOptional,
  IsArray,
  IsString,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';

// PartialType makes all CreateEventDto fields optional for PATCH
export class UpdateEventDto extends PartialType(CreateEventDto) {
  // (Optional) If you want explicit validators (not required, but fine):
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsInt() @Min(1) capacity?: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() tags?: string[];
}
