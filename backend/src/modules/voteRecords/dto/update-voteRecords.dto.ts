import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateVoteRecordsDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
