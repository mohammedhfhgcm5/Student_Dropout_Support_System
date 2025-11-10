/*
  Warnings:

  - You are about to drop the column `completionDate` on the `StudentProgram` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentDate` on the `StudentProgram` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `StudentProgram` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `StudentProgram` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `SupportProgram` table. All the data in the column will be lost.
  - Added the required column `program_id` to the `StudentProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `StudentProgram` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."StudentProgram" DROP CONSTRAINT "StudentProgram_programId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentProgram" DROP CONSTRAINT "StudentProgram_studentId_fkey";

-- AlterTable
ALTER TABLE "public"."StudentProgram" DROP COLUMN "completionDate",
DROP COLUMN "enrollmentDate",
DROP COLUMN "programId",
DROP COLUMN "studentId",
ADD COLUMN     "completion_date" TIMESTAMP(3),
ADD COLUMN     "enrollment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "program_id" INTEGER NOT NULL,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ENROLLED';

-- AlterTable
ALTER TABLE "public"."SupportProgram" DROP COLUMN "isActive",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "duration" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."StudentProgram" ADD CONSTRAINT "StudentProgram_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProgram" ADD CONSTRAINT "StudentProgram_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."SupportProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
