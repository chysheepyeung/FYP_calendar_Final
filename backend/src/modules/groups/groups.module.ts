import { GroupsController } from './groups.controller';
import { GroupsRepository } from '../../database/repositories/groups.repo';
import { GroupsService } from './groups.service';
import { HttpModule } from '@/modules/http/http.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../../database/repositories/users.repo';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([GroupsRepository, UsersRepository]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
