import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVotesDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateStart: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateEnd: Date;

  // @IsOptional()
  // @IsArray()
  // unvoted: UsersEntity[];

  // @IsOptional()
  // @IsArray()
  // agree: UsersEntity[];
}
