import {
  CreateDonationDto,
  SearchFilterDto,
  UpdateDonationDto,
  UpdateStatusDto,
} from './dto/_index';
import { DonationRepository } from '@repo/donation.repo';
import { GetPaymentLinkParam, GetPaymentLinkResponse } from '@share/interfaces';
import { HttpService } from '@/modules/http/http.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable, Logger } from '@nestjs/common';
import { NormalException } from '@/exception/normal.exception';

@Injectable()
export class DonationService {
  private readonly logger = new Logger(DonationService.name);

  constructor(
    readonly i18n: I18nRequestScopeService,
    readonly httpService: HttpService,
    readonly donationRepo: DonationRepository
  ) {}

  async create(param: CreateDonationDto, lang: string) {
    const donationRecord = await this.donationRepo.save({
      ...param,
      amount: param.amount.toString(),
      lang,
    });

    const data = await this.httpService.postToMS<
      GetPaymentLinkResponse,
      GetPaymentLinkParam
    >(
      `${process.env.PAYMENT_BACKEND_URL}/transaction/create`,
      {
        orderId: donationRecord.id,
        amount: param.amount,
        serviceName: process.env.npm_package_name,
        paymentItem: param.donationItem,
      },
      { headers: { 'Content-Language': lang } }
    );

    if (!data?.paymentURL) {
      throw NormalException.UNEXPECTED();
    }

    return {
      orderId: donationRecord.id,
      url: data.paymentURL,
    };
  }

  async updateStatus(data: UpdateStatusDto) {
    this.logger.log('Received update status message');
    const record = await this.donationRepo.findOneOrFail(data.orderId);

    if (record.orderStatus !== data.status) {
      // not use update here since I need to return the updated entity
      const updatedRecord = await this.donationRepo.save({
        ...record,
        orderStatus: data.status,
      });
      // return this.sendEmail(updatedRecord, data.paymentMethod);
    }
    return false;
  }

  async findAll(query: SearchFilterDto) {
    const result = await this.donationRepo.search(
      query.keywords,
      query.pageIndex,
      query.itemsPerPage,
      query.sort,
      query.sortOrder
    );

    const { donationItem, orderStatus } = query;
    if (donationItem)
      result.andWhere('donationItem = :donationItem', { donationItem });
    if (orderStatus)
      result.andWhere('orderStatus = :orderStatus', { orderStatus });

    return result.getManyAndCount();
  }

  async findOne(orderId: string) {
    return (await this.donationRepo.findOne(orderId)) || null;
  }

  async update(id: string, data: UpdateDonationDto) {
    return this.donationRepo.save({
      id,
      ...data,
    });
  }

  /* ********************************
   *       Internal Functions       *
   ******************************** */

  // async sendEmail(record: DonationEntity, paymentMethod: string) {
  //   // will show 'null null null' in the email if not filter empty string
  //   const getAddress = () => {
  //     let str = '';
  //     for (let i = 1; i <= 3; i += 1) {
  //       const addr = record[`addressLine${i}`];
  //       str += addr ? `${addr} ` : '';
  //     }
  //     return str;
  //   };

  //   this.logger.log(
  //     `Emitted send email event to ${process.env.MAIL_QUEUE_NAME}`
  //   );
  //   return 'OK';
  // }
}
