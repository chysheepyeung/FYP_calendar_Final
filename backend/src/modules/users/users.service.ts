import { CreateUsersDto } from './dto/create-users.dto';
import { HttpService } from '@/modules/http/http.service';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable, Logger } from '@nestjs/common';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersRepository } from '../../database/repositories/users.repo';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    readonly i18n: I18nRequestScopeService,
    readonly httpService: HttpService,
    readonly usersRepo: UsersRepository
  ) {}

  async create(param: CreateUsersDto) {
    const newUser = await this.usersRepo.save({
      ...param,
    });

    delete newUser.password;
    return newUser;
  }

  async update(id: number, data: UpdateUsersDto) {
    return this.usersRepo.save({
      id,
      ...data,
    });
  }

  async findOne(userId: number) {
    const user = await this.usersRepo.findOne({
      relations: ['groups'],
      where: { id: userId },
    });
    return user;
  }

  async findOneByEmail(email: string) {
    return (await this.usersRepo.findOne({ email })) || null;
  }
}
