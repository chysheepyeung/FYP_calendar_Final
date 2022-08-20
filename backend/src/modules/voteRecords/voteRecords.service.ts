import { I18nRequestScopeService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { VoteRecordsRepository } from '@repo/voteRecords.repository';

@Injectable()
export class VoteRecordsService {
  constructor(
    private readonly i18n: I18nRequestScopeService,
    private readonly voteRecordsRepo: VoteRecordsRepository
  ) {}

  async update(userId: number, voteId: number, isAccept: boolean) {
    const voteRecord = await this.voteRecordsRepo.findOne({
      where: {
        vote: { id: voteId },
        voter: { id: userId },
      },
    });

    voteRecord.isAccept = isAccept;

    return this.voteRecordsRepo.save({
      ...voteRecord,
    });
  }

  // async findAll(): Promise<VoteRecordsEntity[]> {
  //   return this.voteRecordsRepo.find();
  // }

  // async findOne(id: number): Promise<VoteRecordsEntity> {
  //   return this.voteRecordsRepo.findOneOrFail(id);
  // }

  // async update(id: number, data: UpdateVoteRecordsDto): Promise<boolean> {
  //   return (await this.voteRecordsRepo.update(id, data)).affected > 0;
  // }

  // async remove(id: number): Promise<boolean> {
  //   return (await this.voteRecordsRepo.delete(id)).affected > 0;
  // }
}
