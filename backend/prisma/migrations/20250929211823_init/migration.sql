/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalNumber" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nationalNumber" TEXT NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "donorId" INTEGER NOT NULL,
    "purposeId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DropoutReason" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "DropoutReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DonationPurpose" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DonationPurpose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guardian" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationalNumber" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."school" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "region" TEXT,

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."student" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "nationalNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "mainLanguage" TEXT NOT NULL,
    "acquiredLanguage" TEXT NOT NULL,
    "guardianId" INTEGER,
    "schoolId" INTEGER,
    "locationId" INTEGER,
    "dropoutReasonId" INTEGER,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FollowUpvisit" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "FollowUpvisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_nationalNumber_key" ON "public"."user"("nationalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_email_key" ON "public"."Donor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_nationalNumber_key" ON "public"."Donor"("nationalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "guardian_nationalNumber_key" ON "public"."guardian"("nationalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "student_nationalNumber_key" ON "public"."student"("nationalNumber");

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "public"."Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "public"."DonationPurpose"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_dropoutReasonId_fkey" FOREIGN KEY ("dropoutReasonId") REFERENCES "public"."DropoutReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "public"."guardian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FollowUpvisit" ADD CONSTRAINT "FollowUpvisit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Document" ADD CONSTRAINT "Document_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
