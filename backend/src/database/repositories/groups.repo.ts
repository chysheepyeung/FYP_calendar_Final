import { EntityRepository } from 'typeorm';
import { GroupsEntity } from '../entities/groups.entity';
import { SearchableRepository } from './searchable.repo';
import { SortOrdering } from '@/shared/enums/_index';

@EntityRepository(GroupsEntity)
export class GroupsRepository extends SearchableRepository<GroupsEntity> {
  async getLatestRecord() {
    return this.findOne({ order: { createdAt: SortOrdering.DESC } });
  }
}
