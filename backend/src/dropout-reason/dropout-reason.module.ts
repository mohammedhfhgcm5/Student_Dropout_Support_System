import { Module } from '@nestjs/common';
import { DropoutReasonService } from './dropout-reason.service';
import { DropoutReasonController } from './dropout-reason.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [DropoutReasonController],
  providers: [DropoutReasonService,PrismaService],
})
export class DropoutReasonModule {}
