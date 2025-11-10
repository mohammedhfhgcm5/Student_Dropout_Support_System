/*
  Warnings:

  - A unique constraint covering the columns `[nationalNumber]` on the table `Guardian` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guardian_nationalNumber_key" ON "public"."Guardian"("nationalNumber");
