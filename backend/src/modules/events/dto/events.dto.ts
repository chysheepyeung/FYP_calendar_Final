import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '@/shared/myenums/notificationType';
import { Type } from 'class-transformer';

export class EventsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // @IsNumber()
  // @IsNotEmpty()
  // categoryId: number;

  // @OneToOne(() => CategoryEntity)
  // @JoinColumn({ name: 'categoryId' })
  // category: CategoryEntity;
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
  location: string;

  // @IsBoolean()
  // @IsNotEmpty()
  // isRegular: boolean;

  // @IsEnum(RegularType)
  // @IsOptional()
  // regularType?: RegularType;

  // day eg: 16-22 /24hrs
  // week eg: 1-2,  1-1
  // month eg: 0-31
  // year eg: 18@AUG-19@AUG
  // @IsString()
  // @IsOptional()
  // regularBy?: string;

  @IsBoolean()
  @IsNotEmpty()
  isNotification = false;

  @IsEnum(NotificationType)
  @IsOptional()
  notificationType?: NotificationType;

  // min => 0 to 60
  // hour => 1 to 23
  // day => 0 to 365 (0 for the event day start)
  @IsString()
  @IsOptional()
  notificationBy?: string;
}
