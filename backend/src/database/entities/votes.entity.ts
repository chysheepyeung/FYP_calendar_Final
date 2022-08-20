import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GroupsEntity } from './groups.entity';
import { IsOptional } from 'class-validator';
import { VoteRecordsEntity } from './voteRecords.entity';

@Entity({ name: 'votes' })
export class VotesEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int' })
  typeId = 1;

  @ManyToOne(() => GroupsEntity)
  group: GroupsEntity;

  @Column()
  @IsOptional()
  dateStart: Date;

  @Column()
  @IsOptional()
  dateEnd: Date;

  @Column({ nullable: true })
  @IsOptional()
  location: string;

  @OneToMany(() => VoteRecordsEntity, (voteRecord) => voteRecord.vote)
  voteRecords: VoteRecordsEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
