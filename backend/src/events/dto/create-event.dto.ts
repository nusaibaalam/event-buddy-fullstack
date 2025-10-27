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
  @IsDateString() date!: string;
  @IsInt() @Min(1) capacity!: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsArray() tags?: string[];
}
