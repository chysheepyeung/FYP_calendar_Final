import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteRecordsController } from './voteRecords.controller';
import { VoteRecordsRepository } from '@repo/voteRecords.repository';
import { VoteRecordsService } from './voteRecords.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteRecordsRepository])],
  controllers: [VoteRecordsController],
  providers: [VoteRecordsService],
})
export class VoteRecordsModule {}
