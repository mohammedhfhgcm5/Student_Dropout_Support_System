import { Module } from '@nestjs/common';
import { GuardianInteractionService } from './guardian-interaction.service';
import { GuardianInteractionController } from './guardian-interaction.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ActivityLogService } from 'src/activity-log/activity-log.service';

@Module({
  controllers: [GuardianInteractionController],
  providers: [GuardianInteractionService,PrismaService,ActivityLogService],
})
export class GuardianInteractionModule {}
