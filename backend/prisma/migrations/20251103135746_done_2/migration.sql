/*
  Warnings:

  - You are about to drop the column `userId` on the `Donor` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `School` table. All the data in the column will be lost.
  - Added the required column `nationalNumber` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Guardian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalNumber` to the `Guardian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Donor" DROP CONSTRAINT "Donor_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Donor" DROP COLUMN "userId",
ADD COLUMN     "nationalNumber" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Guardian" DROP COLUMN "name",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "nationalNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."School" DROP COLUMN "type",
ADD COLUMN     "region" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "nationalNumber" TEXT NOT NULL;
