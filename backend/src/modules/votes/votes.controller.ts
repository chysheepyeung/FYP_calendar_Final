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
import { CreateVotesDto } from './dto/create-votes.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SuggestVotesDto } from './dto/suggest-votes.dto';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/event/:groupId')
  async voteEvent(
    @Request() req,
    @Param('groupId') groupId: number,
    @Body() data: CreateVotesDto
  ) {
    return this.votesService.voteEvent(req.user.id, groupId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/location/:groupId')
  async voteLocation(
    @Request() req,
    @Param('groupId') groupId: number,
    @Body() location: string
  ) {
    return this.votesService.voteLocation(req.user.id, groupId, location);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/group/:groupId')
  async findAll(@Request() req, @Param('groupId') groupId: number) {
    return this.votesService.findAll(req.user.id, groupId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':voteId')
  async findOne(@Param('voteId') voteId: number) {
    return this.votesService.findOne(voteId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':voteId')
  async vote(
    @Request() req,
    @Param('voteId') voteId: number,
    @Body() data: { isAccept: boolean }
  ) {
    return this.votesService.vote(req.user.id, voteId, data.isAccept);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':voteId')
  async remove(@Param('voteId') voteId: number) {
    return this.votesService.remove(voteId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('acceptSuggest/:voteId')
  async acceptSuggest(
    @Request() req,
    @Param('voteId') voteId: number,
    @Body() suggest: SuggestVotesDto
  ) {
    return this.votesService.acceptSuggest(req.user.id, voteId, suggest);
  }
}
