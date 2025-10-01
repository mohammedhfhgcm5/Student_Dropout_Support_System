/*
  Warnings:

  - You are about to drop the `FollowUpvisit` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `Donation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gender` on the `student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'STAFF', 'FIELD_OFFICER');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."StudentStatus" AS ENUM ('ACTIVE', 'DROPOUT', 'GRADUATED', 'TRANSFERRED');

-- CreateEnum
CREATE TYPE "public"."DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "public"."FollowUpvisit" DROP CONSTRAINT "FollowUpvisit_studentId_fkey";

-- AlterTable
ALTER TABLE "public"."Donation" DROP COLUMN "status",
ADD COLUMN     "status" "public"."DonationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."student" DROP COLUMN "gender",
ADD COLUMN     "gender" "public"."Gender" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."StudentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "role",
ADD COLUMN     "role" "public"."Role" NOT NULL;

-- DropTable
DROP TABLE "public"."FollowUpvisit";

-- CreateTable
CREATE TABLE "public"."FollowUpVisit" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "FollowUpVisit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FollowUpVisit" ADD CONSTRAINT "FollowUpVisit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
