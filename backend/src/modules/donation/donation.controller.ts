import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateDonationDto,
  SearchFilterDto,
  UpdateDonationDto,
  UpdateStatusDto,
} from './dto/_index';
import { DonationEntity } from '@entity/donation.entity';
import { DonationService } from './donation.service';
import { HttpSuccessData } from '@share/interfaces';
import { I18nLang } from 'nestjs-i18n';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post('public/create')
  async create(@Body() data: CreateDonationDto, @I18nLang() lang: string) {
    return this.donationService.create(data, lang);
  }

  @Get('//')
  async findAll(@Query() query: SearchFilterDto) {
    const items = await this.donationService.findAll(query);
    return <HttpSuccessData<DonationEntity>>{
      items: items[0],
      totalItems: items[1],
      pageIndex: query.pageIndex || 0,
      itemsPerPage: query.itemsPerPage || 10,
    };
  }

  @Get(':orderId')
  async findOne(@Param('orderId') orderId: string) {
    return this.donationService.findOne(orderId);
  }

  @Patch(':orderId')
  async update(
    @Body() data: UpdateDonationDto,
    @Param('orderId') orderId: string
  ) {
    return this.donationService.update(orderId, data);
  }

  // Payload validation not implemented yet [new ValidationPipe()]
  @Post('update-donation-status')
  @MessagePattern('update-donation-status')
  getNotifications(@Payload() @Body() data: UpdateStatusDto) {
    return this.donationService.updateStatus(data);
  }
}
