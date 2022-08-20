import { HttpModule } from '@/modules/http/http.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersRepository } from '../../database/repositories/users.repo';
import { UsersService } from './users.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([UsersRepository])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
