import { EventsController } from './events.controller';
import { EventsRepository } from '../../database/repositories/events.repo';
import { EventsService } from './events.service';
import { GroupsRepository } from '@/database/repositories/groups.repo';
import { HttpModule } from '@/modules/http/http.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesRepository } from '@repo/votes.repository';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      EventsRepository,
      GroupsRepository,
      VotesRepository,
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
