import { DonationEntity } from '@entity/donation.entity';
import { DonationRepository } from '@repo/donation.repo';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

const ID_LENGTH = 6;
@EventSubscriber()
export class DonationSubscriber
  implements EntitySubscriberInterface<DonationEntity>
{
  listenTo() {
    return DonationEntity;
  }

  async beforeInsert(event: InsertEvent<DonationEntity>) {
    const { entity } = event;
    const repo = event.connection.getCustomRepository(DonationRepository);
    const today = new Date();

    // Attention: multiple insert at the same time will get error since it is not an
    // atomic action, so will have chance getting same id and write to db
    const latestRecord = await repo.getLatestRecord();

    let currId = 1;
    if (latestRecord && latestRecord.createdAt.getDay() === today.getDay()) {
      const latestId = latestRecord.id;
      currId = parseInt(latestId.slice(latestId.length - ID_LENGTH), 10) + 1;
    }

    /*
     * Since MPGS orderID should be unique, for our system different environment will duplicate the orderID (different
     * database) so only production use empty prefix.
     */
    const prefix = process.env.ORDER_ID_IDENTIFIER || '';
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = String(today.getFullYear());
    const id = String(currId).padStart(ID_LENGTH, '0');

    entity.id = prefix + entity.donationItem + yyyy + mm + dd + id;
  }
}
