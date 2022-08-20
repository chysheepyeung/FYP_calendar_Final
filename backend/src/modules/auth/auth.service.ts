import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from '../users/dto/create-users.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from '@/database/entities/users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtService
  ) {}

  async validateUserCredentials(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async loginWithCredentials(user: UsersEntity) {
    return {
      token: this.jwtTokenService.sign({
        id: user.id,
        email: user.email,
      }),
    };
  }

  async register(user: CreateUsersDto) {
    const newUser = await this.usersService.create({
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    });

    if (newUser) {
      return {
        ...newUser,
        token: this.jwtTokenService.sign({
          id: newUser.id,
          email: newUser.email,
        }),
      };
    }
    return null;
  }
}
