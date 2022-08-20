import { DonationEntity } from '@entity/donation.entity';
import { EntityRepository } from 'typeorm';
import { SearchableRepository } from './searchable.repo';
import { SortOrdering } from '@/shared/enums/_index';

@EntityRepository(DonationEntity)
export class DonationRepository extends SearchableRepository<DonationEntity> {
  async getLatestRecord() {
    return this.findOne({ order: { createdAt: SortOrdering.DESC } });
  }
}
