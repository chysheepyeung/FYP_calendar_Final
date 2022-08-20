import { EntityRepository } from 'typeorm';
import { SearchableRepository } from './searchable.repo';
import { VotesEntity } from '@entity/votes.entity';

@EntityRepository(VotesEntity)
export class VotesRepository extends SearchableRepository<VotesEntity> {}
