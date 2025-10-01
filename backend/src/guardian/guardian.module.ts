import { Module } from '@nestjs/common';
import { GuardianService } from './guardian.service';
import { GuardianController } from './guardian.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [GuardianController],
  providers: [GuardianService, PrismaService],
})
export class GuardianModule {}
