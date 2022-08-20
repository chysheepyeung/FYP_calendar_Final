import { DonationController } from './donation.controller';
import { DonationRepository } from '@repo/donation.repo';
import { DonationService } from './donation.service';
import { HttpModule } from '@/modules/http/http.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([DonationRepository])],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
