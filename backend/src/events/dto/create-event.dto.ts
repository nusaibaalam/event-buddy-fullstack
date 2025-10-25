import {
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @IsString() title!: string;
  @IsString() description!: string;
  @IsString() location!: string;
  @IsDateString() date!: string; // ISO string e.g., 2025-04-14T15:00:00.000Z
  @IsInt() @Min(1) capacity!: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() tags?: string[];
}
