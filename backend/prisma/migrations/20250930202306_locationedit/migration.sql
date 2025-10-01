/*
  Warnings:

  - A unique constraint covering the columns `[region]` on the table `DropoutReason` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DropoutReason_region_key" ON "public"."DropoutReason"("region");
