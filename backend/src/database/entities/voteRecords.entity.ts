import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '@/database/entities/users.entity';
import { VotesEntity } from '@entity/votes.entity';

@Entity()
export class VoteRecordsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VotesEntity, (votes) => votes.voteRecords)
  vote: VotesEntity;

  @ManyToOne(() => UsersEntity, (users) => users.voteRecords)
  voter: UsersEntity;

  @Column()
  isAccept: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
