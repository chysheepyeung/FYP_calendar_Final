import { I18nRequestScopeService } from 'nestjs-i18n';
import { Test, TestingModule } from '@nestjs/testing';
import { VotesRepository } from '@repo/votes.repository';
import { VotesService } from './votes.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('VotesService', () => {
  let service: VotesService;
  let repo: VotesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: I18nRequestScopeService,
          useValue: {
            t: () => '',
          },
        },
        {
          provide: getRepositoryToken(VotesRepository),
          useClass: VotesRepository,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
    repo = module.get<VotesRepository>(getRepositoryToken(VotesRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
