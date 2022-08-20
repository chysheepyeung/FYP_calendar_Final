import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GroupsDto } from './dto/groups.dto';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('group')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAll(@Request() req) {
    const items = await this.groupsService.findAll(req.user.id);
    return items;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:groupId')
  async findOne(@Param('groupId') groupId: number) {
    return this.groupsService.findOne(groupId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:groupId')
  async update(@Body() data: GroupsDto, @Param('groupId') groupId: number) {
    return this.groupsService.update(groupId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Request() req, @Body() data: GroupsDto) {
    return this.groupsService.create(req.user, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:groupId')
  async delete(@Param('groupId') groupId: number) {
    return this.groupsService.delete(groupId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:groupId/leave')
  async leave(@Request() req, @Param('groupId') groupId: number) {
    return this.groupsService.leave(req.user.id, groupId);
  }
}
