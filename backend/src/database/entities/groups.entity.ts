import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvitesEntity } from '@entity/invites.entity';
import { Searchable } from '@/database/decorators/searchable';
import { VotesEntity } from '@entity/votes.entity';
// eslint-disable-next-line import/no-cycle
import { UsersEntity } from './users.entity';

@Entity({ name: 'groups' })
export class GroupsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Searchable()
  id: number;

  @Column({ length: 100 })
  @Searchable()
  name: string;

  @Column()
  isEventHidden: boolean;

  @Column()
  voteAcceptRate: number;

  @ManyToMany(() => UsersEntity, (users) => users.groups)
  users: UsersEntity[];

  @ManyToOne(() => UsersEntity, (users) => users.id)
  groupOwner: UsersEntity;

  @OneToMany(() => VotesEntity, (votes) => votes.group)
  votes: VotesEntity[];

  @OneToMany(() => InvitesEntity, (invites) => invites.group)
  invites: InvitesEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  isUnvoted: boolean;
}
