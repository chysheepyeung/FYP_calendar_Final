import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UpdateUsersDto } from './dto/_index';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user/:userId')
  async findOne(@Param('userId') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Put('user/:userId')
  async update(@Body() data: UpdateUsersDto, @Param('userId') userId: number) {
    return this.usersService.update(userId, data);
  }
}
