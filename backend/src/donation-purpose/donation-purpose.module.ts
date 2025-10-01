import { Module } from '@nestjs/common';
import { DonationPurposeService } from './donation-purpose.service';
import { DonationPurposeController } from './donation-purpose.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [DonationPurposeController],
  providers: [DonationPurposeService,PrismaService],
})
export class DonationPurposeModule {}
