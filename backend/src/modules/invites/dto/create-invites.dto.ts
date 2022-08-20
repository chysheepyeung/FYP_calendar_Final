import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvitesDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
