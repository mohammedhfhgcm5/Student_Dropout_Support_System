/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedBy` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `fullNamename` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_uploadedBy_fkey";

-- AlterTable
ALTER TABLE "public"."ActivityLog" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Document" DROP COLUMN "isVerified",
DROP COLUMN "uploadedBy";

-- AlterTable
ALTER TABLE "public"."Location" DROP COLUMN "country",
DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "fullNamename",
ADD COLUMN     "fullName" TEXT NOT NULL;
