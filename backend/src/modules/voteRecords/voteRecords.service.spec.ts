import { I18nRequestScopeService } from 'nestjs-i18n';
import { Test, TestingModule } from '@nestjs/testing';
import { VoteRecordsRepository } from '@repo/voteRecords.repository';
import { VoteRecordsService } from './voteRecords.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('voteRecordsService', () => {
  let service: VoteRecordsService;
  let repo: VoteRecordsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteRecordsService,
        {
          provide: I18nRequestScopeService,
          useValue: {
            t: () => '',
          },
        },
        {
          provide: getRepositoryToken(VoteRecordsRepository),
          useClass: VoteRecordsRepository,
        },
      ],
    }).compile();

    service = module.get<VoteRecordsService>(VoteRecordsService);
    repo = module.get<VoteRecordsRepository>(
      getRepositoryToken(VoteRecordsRepository)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });
});
