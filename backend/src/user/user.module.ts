import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
   imports: [ActivityLogModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports:[UserService]
})
export class UserModule {}
