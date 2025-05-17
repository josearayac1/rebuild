/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `UnitApu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UnitApu_name_key" ON "UnitApu"("name");
