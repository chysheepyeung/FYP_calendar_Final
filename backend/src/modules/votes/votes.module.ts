import { EventsRepository } from '@/database/repositories/events.repo';
import { GroupsRepository } from '@/database/repositories/groups.repo';
import { HttpModule } from '../http/http.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '@/database/repositories/users.repo';
import { VoteRecordsRepository } from '../../database/repositories/voteRecords.repository';
import { VotesController } from './votes.controller';
import { VotesRepository } from '@repo/votes.repository';
import { VotesService } from './votes.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      VotesRepository,
      GroupsRepository,
      UsersRepository,
      EventsRepository,
      VoteRecordsRepository,
    ]),
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
