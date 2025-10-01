// import { PrismaClient } from '@prisma/client'
// //npx tsx prisma/seed.ts
// const prisma = new PrismaClient()

// const syrianLocations = [
//   // Aleppo Governorate
//   { name: "Aleppo", region: "Mount Simeon District" },
//   { name: "Aleppo", region: "Al-Bab District" },
//   { name: "Aleppo", region: "Afrin District" },
//   { name: "Aleppo", region: "Azaz District" },
//   { name: "Aleppo", region: "Manbij District" },
//   { name: "Aleppo", region: "Ayn Al-Arab District" },
//   { name: "Aleppo", region: "As-Safira District" },
//   { name: "Aleppo", region: "Jarabulus District" },
//   { name: "Aleppo", region: "Atarib District" },
//   { name: "Aleppo", region: "Dayr Hafir District" },
  
//   // Damascus Governorate
//   { name: "Damascus", region: "Damascus" },
//   { name: "Damascus", region: "Al-Midan" },
//   { name: "Damascus", region: "Al-Qadam" },
//   { name: "Damascus", region: "Al-Qassa'a" },
//   { name: "Damascus", region: "Al-Mazzah" },
//   { name: "Damascus", region: "Kafr Sousa" },
  
//   // Rif Dimashq Governorate
//   { name: "Rif Dimashq", region: "Douma District" },
//   { name: "Rif Dimashq", region: "Rif Dimashq District" },
//   { name: "Rif Dimashq", region: "Darayya District" },
//   { name: "Rif Dimashq", region: "Al-Tall District" },
//   { name: "Rif Dimashq", region: "Yabroud District" },
//   { name: "Rif Dimashq", region: "Al-Zabadani District" },
//   { name: "Rif Dimashq", region: "An-Nabk District" },
//   { name: "Rif Dimashq", region: "Qudsaya District" },
//   { name: "Rif Dimashq", region: "Al-Qutayfah District" },
//   { name: "Rif Dimashq", region: "Qatana District" },
  
//   // Homs Governorate
//   { name: "Homs", region: "Homs District" },
//   { name: "Homs", region: "Al-Rastan District" },
//   { name: "Homs", region: "Palmyra District" },
//   { name: "Homs", region: "Al-Mukharram District" },
//   { name: "Homs", region: "Al-Qusayr District" },
//   { name: "Homs", region: "Talkalakh District" },
  
//   // Hama Governorate
//   { name: "Hama", region: "Hama District" },
//   { name: "Hama", region: "Masyaf District" },
//   { name: "Hama", region: "Al-Suqaylabiyah District" },
//   { name: "Hama", region: "Mhardeh District" },
//   { name: "Hama", region: "Salamiyah District" },
  
//   // Latakia Governorate
//   { name: "Latakia", region: "Latakia District" },
//   { name: "Latakia", region: "Jableh District" },
//   { name: "Latakia", region: "Al-Qardaha District" },
//   { name: "Latakia", region: "Al-Haffah District" },
//   { name: "Latakia", region: "Slanfeh District" },
  
//   // Tartus Governorate
//   { name: "Tartus", region: "Tartus District" },
//   { name: "Tartus", region: "Baniyas District" },
//   { name: "Tartus", region: "Sheikh Badr District" },
//   { name: "Tartus", region: "Dreikish District" },
//   { name: "Tartus", region: "Safita District" },
  
//   // Idlib Governorate
//   { name: "Idlib", region: "Idlib District" },
//   { name: "Idlib", region: "Ariha District" },
//   { name: "Idlib", region: "Maarrat al-Numan District" },
//   { name: "Idlib", region: "Harem District" },
//   { name: "Idlib", region: "Jisr al-Shughur District" },
  
//   // Al-Hasakah Governorate
//   { name: "Al-Hasakah", region: "Al-Hasakah District" },
//   { name: "Al-Hasakah", region: "Qamishli District" },
//   { name: "Al-Hasakah", region: "Al-Malikiyah District" },
//   { name: "Al-Hasakah", region: "Ras al-Ayn District" },
//   { name: "Al-Hasakah", region: "Amuda District" },
  
//   // Deir ez-Zor Governorate
//   { name: "Deir ez-Zor", region: "Deir ez-Zor District" },
//   { name: "Deir ez-Zor", region: "Al-Mayadin District" },
//   { name: "Deir ez-Zor", region: "Al-Bukamal District" },

//   // Raqqa Governorate
//   { name: "Raqqa", region: "Raqqa District" },
//   { name: "Raqqa", region: "Al-Thawra District" },
//   { name: "Raqqa", region: "Tal Abyad District" },
  
//   // As-Suwayda Governorate
//   { name: "As-Suwayda", region: "As-Suwayda District" },
//   { name: "As-Suwayda", region: "Salkhad District" },
//   { name: "As-Suwayda", region: "Shahba District" },
  
//   // Daraa Governorate
//   { name: "Daraa", region: "Daraa District" },
//   { name: "Daraa", region: "Izra' District" },
//   { name: "Daraa", region: "Al-Sanamayn District" },
//   { name: "Daraa", region: "Da'el District" },
//   { name: "Daraa", region: "Al-Sheikh Maskin District" },
  
//   // Quneitra Governorate
//   { name: "Quneitra", region: "Quneitra District" },
//   { name: "Quneitra", region: "Fiq District" },
// ];

// async function main() {
//   console.log('Start seeding...')
  
//   // Delete existing locations
//   await prisma.location.deleteMany()
//   console.log('Deleted existing locations')
  
//   // Create new locations
//   for (const location of syrianLocations) {
//     const createdLocation = await prisma.location.create({
//       data: location
//     })
//     console.log(`Created location: ${createdLocation.name} - ${createdLocation.region}`)
//   }
  
//   console.log('Seeding finished!')
// }

// main()
//   .catch((e) => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })



import { PrismaClient, StudentStatus, Gender, DonationStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ---------- Schools ----------
  const schools:any = [];
  for (let i = 1; i <= 5; i++) {
    const school = await prisma.school.create({
      data: { name: `School ${i}`,  region: `Region ${i}` },
    });
    schools.push(school);
  }

  // ---------- Locations ----------
  const locations:any = [];
  for (let i = 1; i <= 5; i++) {
    const loc = await prisma.location.create({
      data: { name: `Location ${i}`, region: `Region ${i}` },
    });
    locations.push(loc);
  }

  // ---------- DropoutReasons ----------
  const reasons :any = [];
  const reasonNames = ["Financial", "Health", "Relocation", "Family", "Other"];
  for (let i = 0; i < reasonNames.length; i++) {
    const reason = await prisma.dropoutReason.create({
      data: { name: reasonNames[i], region: `Region ${i + 1}` },
    });
    reasons.push(reason);
  }

  // ---------- Guardians ----------
  const guardians :any = [];
  for (let i = 1; i <= 10; i++) {
    const g = await prisma.guardian.create({
      data: {
        fullName: `Guardian ${i}`,
        nationalNumber: `G${1000 + i}`,
        phone: `12345${i}`,
        email: `guardian${i}@mail.com`,
        relationship: i % 2 === 0 ? "Mother" : "Father",
      },
    });
    guardians.push(g);
  }

  // ---------- Donors ----------
  const donors :any = [];
  for (let i = 1; i <= 10; i++) {
    const donor = await prisma.donor.create({
      data: {
        name: `Donor ${i}`,
        email: `donor${i}@mail.com`,
        password: `pass${i}`,
        nationalNumber: `D${1000 + i}`,
      },
    });
    donors.push(donor);
  }

  // ---------- DonationPurposes ----------
  const purposes:any = [];
  const purposeNames = ["Scholarship", "Books", "Uniform", "Transport"];
  for (let i = 0; i < purposeNames.length; i++) {
    const purpose = await prisma.donationPurpose.create({ data: { name: purposeNames[i] } });
    purposes.push(purpose);
  }

  // ---------- Students ----------
  const students:any = [];
  for (let i = 1; i <= 50; i++) {
    const student = await prisma.student.create({
      data: {
        fullName: `Student ${i}`,
        dateOfBirth: new Date(2010 + (i % 5), i % 12, i % 28 + 1),
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        status: Object.values(StudentStatus)[i % 4] as StudentStatus,
        mainLanguage: "Arabic",
        acquiredLanguage: "English",
        guardianId: guardians[i % guardians.length].id,
        schoolId: schools[i % schools.length].id,
        locationId: locations[i % locations.length].id,
        dropoutReasonId: reasons[i % reasons.length].id,
        nationalNumber: `${i}*10`,
      },
    });
    students.push(student);
  }

  // ---------- Donations ----------
  for (let i = 0; i < 100; i++) {
    await prisma.donation.create({
      data: {
        studentId: students[i % students.length].id,
        donorId: donors[i % donors.length].id,
        purposeId: purposes[i % purposes.length].id,
        amount: Math.floor(Math.random() * 1000) + 50,
        status: DonationStatus.COMPLETED,
      },
    });
  }

  // ---------- FollowUpVisits ----------
  for (let i = 0; i < 50; i++) {
    await prisma.followUpVisit.create({
      data: {
        studentId: students[i % students.length].id,
        date: new Date(2025, i % 12, (i % 28) + 1),
        note: `Follow-up visit ${i + 1}`,
      },
    });
  }

  // ---------- Documents ----------
  for (let i = 0; i < 50; i++) {
    await prisma.document.create({
      data: {
        studentId: students[i % students.length].id,
        filePath: `/uploads/doc${i + 1}.pdf`,
        type: i % 2 === 0 ? "ID" : "Report Card",
      },
    });
  }

  console.log("✅ All seed data created!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect(); });
