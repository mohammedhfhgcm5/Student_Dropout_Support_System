/*
  Warnings:

  - You are about to drop the column `entityId` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `newValue` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nationalNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullNamename` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ActivityLog" DROP COLUMN "entityId",
DROP COLUMN "entityType",
DROP COLUMN "ipAddress",
DROP COLUMN "newValue",
DROP COLUMN "oldValue",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "nationalNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name",
ADD COLUMN     "fullNamename" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_nationalNumber_key" ON "public"."Student"("nationalNumber");
