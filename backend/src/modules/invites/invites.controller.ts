import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateInvitesDto } from './dto/create-invites.dto';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invite')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() data: CreateInvitesDto) {
    return this.invitesService.create(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.invitesService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':invitesId')
  async findOne(@Param('invitesId') invitesId: number) {
    return this.invitesService.findOne(invitesId);
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':invitesId')
  // async update(
  //   @Param('invitesId') invitesId: number,
  //   @Body() data: UpdateInvitesDto
  // ) {
  //   return this.invitesService.update(invitesId, data);
  // }
  @UseGuards(JwtAuthGuard)
  @Post('/handle/:invitesId')
  async handle(
    @Request() req,
    @Param('invitesId') invitesId: number,
    @Body() data: { isAccept: boolean }
  ) {
    if (data.isAccept)
      await this.invitesService.acceptInvite(req.user, invitesId);
    return this.invitesService.remove(invitesId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':invitesId')
  async remove(@Param('invitesId') invitesId: number) {
    return this.invitesService.remove(invitesId);
  }
}
