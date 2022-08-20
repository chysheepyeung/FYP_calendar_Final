import { InvitesEntity } from '@entity/invites.entity';
import { VoteRecordsEntity } from './voteRecords.entity';
/* eslint-disable import/no-cycle */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventsEntity } from './events.entity';
import { GroupsEntity } from './groups.entity';
import { Searchable } from '@/database/decorators/searchable';

@Entity({ name: 'users' })
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Searchable()
  id: number;

  @Column({ unique: true })
  @Searchable()
  email: string;

  @Column()
  password: string;

  @Column({ length: 100 })
  @Searchable()
  firstName: string;

  @Column({ length: 100 })
  @Searchable()
  lastName: string;

  @Column({ nullable: true })
  address?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;

  @ManyToMany(() => GroupsEntity, (groups) => groups.users, { cascade: true })
  @JoinTable({
    name: 'users_groups',
    joinColumn: {
      name: 'users_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'groups_id',
      referencedColumnName: 'id',
    },
  })
  groups: GroupsEntity[];

  @OneToMany(() => EventsEntity, (event) => event.user)
  events: EventsEntity[];

  @OneToMany(() => GroupsEntity, (group) => group.groupOwner)
  groupOwner: GroupsEntity[];

  @OneToMany(() => VoteRecordsEntity, (voteRecords) => voteRecords.voter)
  voteRecords: VoteRecordsEntity[];

  @OneToMany(() => InvitesEntity, (invite) => invite.sender)
  sender: InvitesEntity[];

  @OneToMany(() => InvitesEntity, (invite) => invite.recipient)
  recipient: InvitesEntity[];
}
