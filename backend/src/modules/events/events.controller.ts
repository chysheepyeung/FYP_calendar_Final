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
import { CalEventsDto } from './dto/cal-events.dto';
import { EventsDto } from './dto/events.dto';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateEventsDto } from './dto/update-events.dto';

@Controller('event')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findAll(@Request() req) {
    const items = await this.eventsService.findAll(req.user.id);
    return items;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:eventId')
  async findOne(@Param('eventId') eventId: number) {
    return this.eventsService.findOne(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:eventId')
  async update(
    @Body() data: UpdateEventsDto,
    @Param('eventId') eventId: number
  ) {
    return this.eventsService.update(eventId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async create(@Request() req, @Body() data: EventsDto) {
    return this.eventsService.create(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:eventId')
  async delete(@Param('eventId') eventId: number) {
    return this.eventsService.delete(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('findFreeDays/:groupId')
  async findFreeDays(
    @Param('groupId') groupId: number,
    @Body() criteria: CalEventsDto
  ) {
    return this.eventsService.findFreeDays(groupId, criteria);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkDup/:voteId')
  async checkDup(@Request() req, @Param('voteId') voteId: number) {
    return this.eventsService.checkDup(req.user.id, voteId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('suggest/:eventId')
  async suggest(@Request() req, @Param('eventId') eventId: number) {
    return this.eventsService.suggest(req.user.id, eventId);
  }
}
