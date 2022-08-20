import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Searchable } from '@/database/decorators/searchable';
// eslint-disable-next-line import/no-cycle
import { UsersEntity } from './users.entity';

@Entity({ name: 'events' })
export class EventsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.events)
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column({ length: 100 })
  @Searchable()
  name: string;

  // @Column({ length: 100, nullable: true })
  // @Searchable()
  // categoryId: number;

  // @OneToOne(() => CategoryEntity)
  // @JoinColumn({ name: 'categoryId' })
  // category: CategoryEntity;

  @Column({ type: 'datetime' })
  @Searchable()
  dateStart: Date;

  @Column({ type: 'datetime' })
  @Searchable()
  dateEnd: Date;

  @Column({ nullable: true })
  @Searchable()
  location: string;

  @Column({ nullable: true })
  @Searchable()
  GUID: string;

  // @Column()
  // @Searchable()
  // isRegular: boolean;

  // @Column({ type: 'enum', enum: RegularType, nullable: true })
  // regularType?: RegularType;

  // // day eg: 16-22 /24hrs
  // // week eg: 1-2,  1-1
  // // month eg: 0-31
  // // year eg: 18@AUG-19@AUG
  // @Column({ nullable: true })
  // regularBy?: string;

  // @Column()
  // isNotification: boolean;

  // @Column({ type: 'enum', enum: NotificationType, nullable: true })
  // notificationType?: NotificationType;

  // // min => 0 to 60
  // // hour => 1 to 23
  // // day => 0 to 365 (0 for the event day start)
  // @Column({ nullable: true })
  // notificationBy?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;
}
