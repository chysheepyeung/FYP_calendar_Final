import { CreateInvitesDto } from './dto/_index';
import { GroupsRepository } from '../../database/repositories/groups.repo';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { InvitesEntity } from '@entity/invites.entity';
import { InvitesRepository } from '@repo/invites.repository';
import { NormalException } from '../../exception/normal.exception';
import { UsersEntity } from '@entity/users.entity';
import { UsersRepository } from '../../database/repositories/users.repo';
import { getManager } from 'typeorm';

@Injectable()
export class InvitesService {
  constructor(
    private readonly i18n: I18nRequestScopeService,
    private readonly invitesRepo: InvitesRepository,
    private readonly groupsRepo: GroupsRepository,
    private readonly usersRepo: UsersRepository
  ) {}

  async create(userId: number, data: CreateInvitesDto): Promise<InvitesEntity> {
    const { email, groupId } = data;
    const recipientUser = await this.usersRepo.findOne({ email });
    if (recipientUser == null) {
      throw NormalException.UNEXPECTED('Cannot find this user');
    }
    const newInvites = await this.invitesRepo.save({
      recipient: { id: recipientUser.id },
      senderId: { id: userId },
      group: { id: groupId },
    });
    return newInvites;
  }

  async findAll(userId: number) {
    return this.invitesRepo.find({
      relations: ['group'],
      where: { recipient: { id: userId } },
    });
  }

  async findOne(invitesId: number): Promise<InvitesEntity> {
    return this.invitesRepo.findOneOrFail(invitesId);
  }

  // async update(invitesId: number, data: UpdateInvitesDto): Promise<boolean> {
  //   return (await this.invitesRepo.update(invitesId, data)).affected > 0;
  // }

  async remove(invitesId: number): Promise<boolean> {
    return (await this.invitesRepo.delete(invitesId)).affected > 0;
  }

  async acceptInvite(user: UsersEntity, invitesId: number) {
    try {
      const result = await this.invitesRepo.findOne({
        relations: ['group'],
        where: { id: invitesId },
      });

      const entityManager = getManager();
      return await entityManager.query(
        'INSERT INTO users_groups VALUES (?, ?)',
        [user.id, result.group.id]
      );
    } catch (error) {
      //
    }
    return null;
  }
}
