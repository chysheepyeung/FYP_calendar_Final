import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateVoteRecordsDto {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
