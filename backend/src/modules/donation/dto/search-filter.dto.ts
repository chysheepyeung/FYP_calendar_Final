import { DonationItem, OrderStatus, SortOrdering } from '@/shared/enums/_index';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchFilterDto {
  @IsString()
  @IsOptional()
  readonly keywords?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly pageIndex?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly itemsPerPage?: number;

  @IsEnum(DonationItem)
  @IsOptional()
  readonly donationItem?: DonationItem;

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly orderStatus?: OrderStatus;

  @IsString()
  @IsOptional()
  readonly sort?: string;

  @IsEnum(SortOrdering)
  @IsOptional()
  readonly sortOrder?: SortOrdering;
}
