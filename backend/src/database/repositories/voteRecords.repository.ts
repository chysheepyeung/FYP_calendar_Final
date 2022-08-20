import { EntityRepository } from 'typeorm';
import { SearchableRepository } from './searchable.repo';
import { VoteRecordsEntity } from '../entities/voteRecords.entity';

@EntityRepository(VoteRecordsEntity)
export class VoteRecordsRepository extends SearchableRepository<VoteRecordsEntity> {}
