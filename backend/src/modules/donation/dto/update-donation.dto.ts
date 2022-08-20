import { DonorTitle, OrderStatus } from '@share/enums/_index';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateDonationDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  readonly orderStatus: OrderStatus;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  /*
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly donationItem: string;
 */

  @IsBoolean()
  @IsNotEmpty()
  readonly isRequiredReceipt: boolean;

  @IsEnum(DonorTitle)
  @IsOptional()
  readonly donorTitle?: DonorTitle;

  @IsNotEmpty()
  @ValidateIf((o) => o.isRequiredReceipt === true)
  readonly firstName?: string;

  @IsNotEmpty()
  @ValidateIf((o) => o.isRequiredReceipt === true)
  readonly lastName?: string;

  // Currenly IsPhoneNumber seems not working https://github.com/typestack/class-validator/pull/1454
  @MinLength(8)
  @IsNumberString()
  @IsNotEmpty()
  @ValidateIf((o) => o.isRequiredReceipt === true)
  readonly phone?: string;

  @IsString()
  @IsOptional()
  readonly address?: string;

  @IsString()
  @IsOptional()
  readonly organization?: string;

  @IsString()
  @IsOptional()
  readonly occupation?: string;

  @Min(new Date().getFullYear() - 125)
  @Max(new Date().getFullYear())
  @IsInt()
  @IsOptional()
  readonly birthYear?: number;
}
