import { AppService } from '@/app.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: I18nRequestScopeService,
          useValue: {
            t: () => '',
          },
        },
      ],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('get version number', () => {
    it('should return version number', async () => {
      expect(await service.getVersion()).toContain(
        process.env.npm_package_version
      );
    });
  });
});
