import { EntityRepository } from 'typeorm';
import { InvitesEntity } from '@entity/invites.entity';
import { SearchableRepository } from './searchable.repo';

@EntityRepository(InvitesEntity)
export class InvitesRepository extends SearchableRepository<InvitesEntity> {}
