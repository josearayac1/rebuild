/*
  Warnings:

  - Added the required column `visitDate` to the `Inspection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inspection" ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "visitDate" TIMESTAMP(3) NOT NULL;
