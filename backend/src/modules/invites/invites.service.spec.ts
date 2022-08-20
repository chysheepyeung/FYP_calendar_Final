import { I18nRequestScopeService } from 'nestjs-i18n';
import { InvitesRepository } from '@repo/invites.repository';
import { InvitesService } from './invites.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('InvitesService', () => {
  let service: InvitesService;
  let repo: InvitesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitesService,
        {
          provide: I18nRequestScopeService,
          useValue: {
            t: () => '',
          },
        },
        {
          provide: getRepositoryToken(InvitesRepository),
          useClass: InvitesRepository,
        },
      ],
    }).compile();

    service = module.get<InvitesService>(InvitesService);
    repo = module.get<InvitesRepository>(getRepositoryToken(InvitesRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
