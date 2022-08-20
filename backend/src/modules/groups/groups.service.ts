import { GroupsDto } from './dto/_index';
import { GroupsRepository } from '../../database/repositories/groups.repo';
import { HttpService } from '@/modules/http/http.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable, Logger } from '@nestjs/common';
import { UsersEntity } from '@/database/entities/users.entity';
import { UsersRepository } from '@/database/repositories/users.repo';
import { getManager } from 'typeorm';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    readonly i18n: I18nRequestScopeService,
    readonly httpService: HttpService,
    readonly groupsRepo: GroupsRepository,
    readonly usersRepo: UsersRepository
  ) {}

  async create(user: UsersEntity, param: GroupsDto) {
    const userArr = new Array<UsersEntity>();
    userArr.push(user);
    const newGroup = await this.groupsRepo.save({
      ...param,
      users: userArr,
      groupOwner: { id: user.id },
    });

    return newGroup;
  }

  async update(id: number, data: GroupsDto) {
    return this.groupsRepo.update(id, {
      ...data,
    });
  }

  async findOne(groupsId: number) {
    const group = await this.groupsRepo.findOne({
      relations: ['users', 'users.events', 'users.events.user'],
      where: { id: groupsId },
    });

    return group;
  }

  async findAll(userId: number) {
    const user = await this.usersRepo.findOne({
      relations: [
        'groups',
        'groups.users',
        'groups.groupOwner',
        'groups.votes',
        'groups.votes.voteRecords',
        'groups.votes.voteRecords.voter',
      ],
      where: { id: userId },
    });

    user.groups.forEach((group) => {
      let isUnvoted = false;
      group.votes.forEach((vote) => {
        if (vote.voteRecords.length === 0) {
          isUnvoted = true;
        } else {
          let isVotedInRecord = false;
          vote.voteRecords.forEach((record) => {
            if (record.voter.id === userId) {
              isVotedInRecord = true;
            }
          });

          if (!isVotedInRecord) {
            isUnvoted = true;
          }
        }
      });

      if (isUnvoted) {
        // eslint-disable-next-line no-param-reassign
        group.isUnvoted = true;
      } else {
        // eslint-disable-next-line no-param-reassign
        group.isUnvoted = false;
      }
    });
    return user.groups;
  }

  async delete(groupsId: number) {
    return (await this.groupsRepo.delete(groupsId)) || null;
  }

  async leave(userId: number, groupsId: number) {
    const entityManager = getManager();
    return entityManager.query(
      'DELETE FROM users_groups WHERE users_id = ? AND groups_id = ?',
      [userId, groupsId]
    );
  }
}
