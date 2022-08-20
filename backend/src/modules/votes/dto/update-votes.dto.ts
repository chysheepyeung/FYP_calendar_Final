import { IsArray, IsNotEmpty } from 'class-validator';
import { UsersEntity } from '../../../database/entities/users.entity';

export class UpdateVotesDto {
  @IsNotEmpty()
  @IsArray()
  unvoted: UsersEntity[];

  @IsNotEmpty()
  @IsArray()
  agree: UsersEntity[];

  @IsNotEmpty()
  @IsArray()
  disagree: UsersEntity[];
}
