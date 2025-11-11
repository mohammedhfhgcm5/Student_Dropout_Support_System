import {
  PrismaClient,
  Role,
  Gender,
  StudentStatus,
  DonationStatus,
  VisitType,
  InteractionType,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ========== 1️⃣ إنشاء مستخدم إداري (Admin) ==========
  const adminEmail = 'admin@student-support.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        fullName: 'System Administrator',
        email: adminEmail,
        passwordHash,
        role: Role.ADMIN,
        nationalNumber: '1000000000',
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin already exists');
  }

  // ========== 2️⃣ إنشاء Donor (متبرع) تجريبي ==========
  const donorEmail = 'donor@example.com';
  const existingDonor = await prisma.donor.findUnique({
    where: { email: donorEmail },
  });

  if (!existingDonor) {
    const passwordHash = await bcrypt.hash('Donor@123', 10);
    await prisma.donor.create({
      data: {
        name: 'John Donor',
        email: donorEmail,
        passwordHash,
        nationalNumber: '2222222222',
        phone: '+963999999999',
        verified: true,
      },
    });
    console.log('✅ Test donor created');
  } else {
    console.log('ℹ️ Donor already exists');
  }

  // ========== 3️⃣ إضافة Guardian ==========
  const guardian = await prisma.guardian.upsert({
    where: { nationalNumber: '3333333333' },
    update: {},
    create: {
      fullName: 'Mohammed Al-Hassan',
      nationalNumber: '3333333333',
      phone: '+963998887766',
      relationToStudent: 'Father',
    },
  });
  console.log('✅ Guardian created');

  // ========== 4️⃣ إنشاء موقع ومدرسة ==========
  const location = await prisma.location.create({
    data: {
      name: 'Aleppo',
      region: 'North',
    },
  });

  const school = await prisma.school.create({
    data: {
      name: 'Al Amal Primary School',
      region: 'Aleppo North',
      address: 'Main Street',
      capacity: 500,
      contactInfo: '+963987654321',
      locationId: location.id,
    },
  });
  console.log('✅ School and location created');

  // ========== 5️⃣ إنشاء طالب ==========
  const existingStudent = await prisma.student.findUnique({
    where: { nationalNumber: '5555555555' },
  });

  let student;

  if (!existingStudent) {
    student = await prisma.student.create({
      data: {
        fullName: 'Ahmad Khaled',
        dateOfBirth: new Date('2012-05-10'),
        gender: Gender.MALE,
        status: StudentStatus.ACTIVE,
        nationalNumber: '5555555555',
        mainLanguage: 'Arabic',
        guardianId: guardian.id,
        schoolId: school.id,
        locationId: location.id,
      },
    });
    console.log('✅ Student created');
  } else {
    student = existingStudent;
    console.log('ℹ️ Student already exists');
  }

  // ========== 6️⃣ إنشاء هدف تبرع ==========
  const purpose = await prisma.donationPurpose.create({
    data: {
      name: 'School Supplies',
      description: 'Providing school bags and stationery',
    },
  });
  console.log('✅ Donation purpose created');

  // ========== 7️⃣ إنشاء تبرع ==========
  const donor = await prisma.donor.findUnique({ where: { email: donorEmail } });
  if (donor) {
    await prisma.donation.create({
      data: {
        donorId: donor.id,
        studentId: student.id,
        purposeId: purpose.id,
        amount: 100.0,
        currency: 'USD',
        status: DonationStatus.CONFIRMED,
        paymentMethod: 'IMAGINARY_PAYMENT',
        transactionReference: 'TXN123456',
      },
    });
    console.log('✅ Donation created');
  }

  // ========== 8️⃣ إنشاء زيارة متابعة ==========
  const user = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (user) {
    await prisma.followUpVisit.create({
      data: {
        studentId: student.id,
        userId: user.id,
        visitDate: new Date(),
        visitType: VisitType.REGULAR,
        notes: 'Student is progressing well',
        studentStatusAssessment: 'Stable',
        recommendations: 'Continue current support',
      },
    });
    console.log('✅ Follow-up visit created');
  }

  // ========== 9️⃣ إنشاء تفاعل ولي أمر ==========
  await prisma.guardianInteraction.create({
    data: {
      studentId: student.id,
      guardianId: guardian.id,
      userId: user?.id || 1,
      interactionType: InteractionType.PHONE_CALL,
      date: new Date(),
      notes: 'Discussed attendance improvement',
    },
  });
  console.log('✅ Guardian interaction created');

  // ========== 🔟 إنشاء إشعار ==========
  await prisma.notification.create({
    data: {
      donorId: donor?.id,
      type: 'DONOR_ALERT',
      title: 'Thank You for Your Donation!',
      message: 'Your support has helped a student continue studying.',
      link: 'https://student-support.org/donations',
    },
  });
  console.log('✅ Notification created');

  console.log('🌱 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
