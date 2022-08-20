import { DonationItem } from '@/shared/enums/donationItem';
import { DonorTitle, PlatformType } from '@share/enums/_index';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateDonationDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsEnum(DonationItem)
  @IsNotEmpty()
  readonly donationItem: DonationItem;

  @IsBoolean()
  @IsNotEmpty()
  readonly isRequiredReceipt: boolean;

  @IsString()
  @IsNotEmpty()
  readonly platform: PlatformType;

  @IsEnum(DonorTitle)
  @IsOptional()
  readonly donorTitle?: DonorTitle;

  @IsNotEmpty()
  @ValidateIf((o) => o.isRequiredReceipt && o.platform !== PlatformType.KIOSK)
  readonly firstName?: string;

  @IsNotEmpty()
  @ValidateIf((o) => o.isRequiredReceipt && o.platform !== PlatformType.KIOSK)
  readonly lastName?: string;

  // Currenly IsPhoneNumber seems not working https://github.com/typestack/class-validator/pull/1454
  @MinLength(8)
  @IsNumberString()
  @IsNotEmpty()
  @ValidateIf((o) => o.isRequiredReceipt && o.platform !== PlatformType.KIOSK)
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
