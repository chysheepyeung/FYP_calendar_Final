import { CreateDonationDto } from './dto/create-donation.dto';
import { DonationItem } from '@/shared/enums/donationItem';
import { DonationRepository } from '@repo/donation.repo';
import { DonationService } from './donation.service';
import { GetPaymentLinkResponse, HttpResponse } from '@share/interfaces';
import { HttpService } from '@/modules/http/http.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { MAIL_QUEUE } from '@share/constants';
import { PlatformType } from '@share/enums/_index';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = {
  create: jest.fn(),
  update: jest.fn(),
  save(data: any) {
    return { ...data, id: (Math.random() + 1).toString(36).substring(5) };
  },
};

const mockResponse = <T>(data: T, isSuccess = true) => {
  const response: HttpResponse<T> = isSuccess
    ? { data }
    : { error: { message: (<any>data)?.message, code: (<any>data)?.code } };
  return response;
};

describe('DonationService', () => {
  let service: DonationService;
  let httpService: HttpService;
  let mockCreateDonation: CreateDonationDto;
  let mockGetPaymentLinkResponse: GetPaymentLinkResponse;
  let initDataset: () => void;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DonationService,
        HttpService,
        {
          provide: I18nRequestScopeService,
          useValue: {
            t: (key: string) => key,
          },
        },
        {
          provide: getRepositoryToken(DonationRepository),
          useValue: mockRepository,
        },
        {
          provide: MAIL_QUEUE,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DonationService>(DonationService);
    httpService = module.get<HttpService>(HttpService);

    // Put all dataset in the bottom to enhance readability
    initDataset();
  });

  describe('Create Donation Record', () => {
    it('CREATE FAILED: should throw payment gateway response error', async () => {
      jest.spyOn(httpService, 'post').mockResolvedValue(
        mockResponse(
          {
            message: 'payment_error_message',
            code: 0,
          },
          false
        )
      );

      try {
        await service.create(mockCreateDonation, 'en-US');
      } catch (error) {
        expect(error.response.code).toBe(10007);
        expect(error.response.message).toBe('payment_error_message');
      }
    });

    it('CREATE FAILED: should throw unexpected error (no data)', async () => {
      jest.spyOn(httpService, 'post').mockResolvedValue(mockResponse(null));

      try {
        await service.create(mockCreateDonation, 'en-US');
      } catch (error) {
        expect(error.response.code).toBe(20001);
        expect(error.response.message).toBe('donation.create.no_payment_url');
      }
    });

    it('CREATE FAILED: should throw unexpected error (no paymentURL)', async () => {
      jest.spyOn(httpService, 'post').mockResolvedValue(
        mockResponse({
          paymentURL: null,
        })
      );

      try {
        await service.create(mockCreateDonation, 'en-US');
      } catch (error) {
        expect(error.response.code).toBe(20001);
        expect(error.response.message).toBe('donation.create.no_payment_url');
      }
    });

    it('CREATE SUCCESS: should return paymentURL', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockResolvedValue(mockResponse(mockGetPaymentLinkResponse));
      const result = await service.create(mockCreateDonation, 'en-US');
      expect(result.url).toBe(mockGetPaymentLinkResponse.paymentURL);
    });
  });

  initDataset = () => {
    mockCreateDonation = {
      email: 'email',
      amount: 100,
      donationItem: DonationItem.CF,
      isRequiredReceipt: false,
      platform: PlatformType.WEBSITE,
    };
    mockGetPaymentLinkResponse = {
      paymentURL: 'paymentURL',
    };
  };
});
