import { Module } from '@nestjs/common';
import { FollowUpVisitService } from './follow-up-visit.service';
import { FollowUpVisitController } from './follow-up-visit.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [FollowUpVisitController],
  providers: [FollowUpVisitService,PrismaService],
})
export class FollowUpVisitModule {}
