import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SuggestVotesDto {
  @IsNotEmpty()
  @IsNumber()
  eventId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateStart: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateEnd: Date;
}
