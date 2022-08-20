// import {
//   BaseEntity,
//   Column,
//   CreateDateColumn,
//   DeleteDateColumn,
//   Entity,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Searchable } from '@/database/decorators/searchable';

// @Entity({ name: 'category' })
// export class CategoryEntity extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ length: 100 })
//   @Searchable()
//   name: string;

//   @Column({ length: 20 })
//   @Searchable()
//   color: string;

//   @Column()
//   @Searchable()
//   isPrivate: boolean;

//   @Column()
//   @Searchable()
//   isOptional: boolean;

//   @CreateDateColumn({ type: 'timestamp' })
//   createdAt: Date;

//   @UpdateDateColumn({ type: 'timestamp' })
//   updatedAt: Date;

//   @DeleteDateColumn({ type: 'timestamp' })
//   deletedAt: Date | null;
// }
