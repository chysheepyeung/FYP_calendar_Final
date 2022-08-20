import { IsEmail, IsNotEmpty } from 'class-validator';

export class SearchUsersDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
