import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GroupsEntity } from './groups.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'invites' })
export class InvitesEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (users) => users.id)
  sender: UsersEntity;

  @ManyToOne(() => UsersEntity, (users) => users.id)
  recipient: UsersEntity;

  @ManyToOne(() => GroupsEntity, (groups) => groups.id)
  group: GroupsEntity;
}
