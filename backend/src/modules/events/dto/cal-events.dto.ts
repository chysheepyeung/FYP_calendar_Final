import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CalEventsDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateFrom: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateTo: Date;

  @IsNumber()
  @IsNotEmpty()
  hourFrom: number;

  @IsNumber()
  @IsNotEmpty()
  minFrom: number;

  @IsNumber()
  @IsNotEmpty()
  hourTo: number;

  @IsNumber()
  @IsNotEmpty()
  minTo: number;
}
