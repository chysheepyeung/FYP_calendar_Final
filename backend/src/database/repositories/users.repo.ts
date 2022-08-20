import { EntityRepository } from 'typeorm';
import { SearchableRepository } from './searchable.repo';
import { SortOrdering } from '@/shared/enums/_index';
import { UsersEntity } from '../entities/users.entity';

@EntityRepository(UsersEntity)
export class UsersRepository extends SearchableRepository<UsersEntity> {
  async getLatestRecord() {
    return this.findOne({ order: { createdAt: SortOrdering.DESC } });
  }
}
