import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { DonorModule } from './donor/donor.module';
import { DonationModule } from './donation/donation.module';
import { LocationModule } from './location/location.module';
import { DropoutReasonModule } from './dropout-reason/dropout-reason.module';
import { DonationPurposeModule } from './donation-purpose/donation-purpose.module';
import { GuardianModule } from './guardian/guardian.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { FollowUpVisitModule } from './follow-up-visit/follow-up-visit.module';
import { DocumentModule } from './document/document.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, ActivityLogModule,AuthModule, DonorModule, DonationModule, LocationModule, DropoutReasonModule, DonationPurposeModule, GuardianModule, SchoolModule, StudentModule, FollowUpVisitModule, DocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
