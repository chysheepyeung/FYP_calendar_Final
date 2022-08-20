import {} from './dto/update-voteRecords.dto';
import {
  Body,
  Controller,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VoteRecordsService } from './voteRecords.service';

@Controller('voteRecords')
export class VoteRecordsController {
  constructor(private readonly voteRecordsService: VoteRecordsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('/:voteId')
  async update(
    @Request() req,
    @Param('voteId') voteId: number,
    @Body() isAccept: boolean
  ) {
    return this.voteRecordsService.update(req.user.id, voteId, isAccept);
  }

  // @Get()
  // async findAll() {
  //   return this.voteRecordsService.findAll();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.voteRecordsService.findOne(+id);
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() data: UpdateVoteRecordsDto) {
  //   return this.voteRecordsService.update(+id, data);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return this.voteRecordsService.remove(+id);
  // }
}
