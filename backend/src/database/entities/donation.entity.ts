import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DonationItem } from '@/shared/enums/donationItem';
import { DonorTitle, OrderStatus } from '@share/enums/_index';
import { Reportable } from '@/database/decorators/reportable';
import { Searchable } from '@/database/decorators/searchable';

@Entity({ name: 'donation' })
export class DonationEntity extends BaseEntity {
  @PrimaryColumn({ length: 16 })
  @Searchable()
  @Reportable({ name: 'ID' })
  id: string;

  @Column()
  @Searchable()
  @Reportable({ name: 'Email' })
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Reportable({ name: 'Amount' })
  amount: string;

  @Column({ type: 'enum', enum: DonationItem })
  @Searchable()
  @Reportable({ name: 'Donation Item' })
  donationItem: DonationItem;

  @Column({ type: 'boolean' })
  isRequiredReceipt: boolean;

  @Column({ type: 'enum', enum: DonorTitle, nullable: true })
  @Reportable({ name: 'Donor Title' })
  donorTitle?: DonorTitle;

  @Column({ length: 100, nullable: true })
  @Searchable()
  @Reportable({ name: 'First Name' })
  firstName?: string;

  @Column({ length: 100, nullable: true })
  @Searchable()
  @Reportable({ name: 'Last Name' })
  lastName?: string;

  @Column({ length: 15, nullable: true })
  @Searchable()
  @Reportable({ name: 'Phone' })
  phone?: string;

  @Column({ nullable: true })
  @Reportable({ name: 'Address1' })
  addressLine1?: string;

  @Column({ nullable: true })
  @Reportable({ name: 'Address2' })
  addressLine2?: string;

  @Column({ nullable: true })
  @Reportable({ name: 'Address3' })
  addressLine3?: string;

  @Column({ nullable: true })
  organization?: string;

  @Column({ length: 20, nullable: true })
  occupation?: string;

  @Column({ type: 'int', nullable: true })
  birthYear?: number;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.SUBMITTED })
  @Reportable({ name: 'Status' })
  orderStatus: OrderStatus;

  @Column({ length: 5, default: 'zh-TW' })
  lang: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Reportable({ name: 'Created At' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Reportable({ name: 'Updated At' })
  updatedAt: number;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date | null;
}
