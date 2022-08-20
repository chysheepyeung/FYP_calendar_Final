import { GroupsRepository } from '../../database/repositories/groups.repo';
import { InvitesController } from './invites.controller';
import { InvitesRepository } from '@repo/invites.repository';
import { InvitesService } from './invites.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '@/database/repositories/users.repo';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvitesRepository,
      GroupsRepository,
      UsersRepository,
    ]),
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
})
export class InvitesModule {}
