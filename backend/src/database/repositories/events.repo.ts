import { EntityRepository } from 'typeorm';
import { EventsEntity } from '../entities/events.entity';
import { SearchableRepository } from './searchable.repo';
import { SortOrdering } from '@/shared/enums/_index';

@EntityRepository(EventsEntity)
export class EventsRepository extends SearchableRepository<EventsEntity> {
  async getLatestRecord() {
    return this.findOne({ order: { createdAt: SortOrdering.DESC } });
  }
}
