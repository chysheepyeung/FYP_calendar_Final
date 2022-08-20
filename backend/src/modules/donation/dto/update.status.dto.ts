import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@/shared/enums/_index';

// Initial Design
export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  readonly orderId: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  readonly status: OrderStatus;

  @IsString()
  @IsOptional()
  readonly paymentMethod: string;
}
