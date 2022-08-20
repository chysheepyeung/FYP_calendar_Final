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

export class UpdateEventsDto {
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

  @IsBoolean()
  @IsOptional()
  isNotiUpdated = false;

  @IsBoolean()
  @IsOptional()
  isGroupEvent = false;

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
