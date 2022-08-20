import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EventsDbDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsNumber()
  // @IsNotEmpty()
  // categoryId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateStart: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateEnd: Date;

  @IsString()
  @IsOptional()
  location: string = null;

  @IsString()
  @IsOptional()
  GUID: string = null;
}
