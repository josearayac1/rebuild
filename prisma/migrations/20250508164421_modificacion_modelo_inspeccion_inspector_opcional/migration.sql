-- DropForeignKey
ALTER TABLE "Inspection" DROP CONSTRAINT "Inspection_inspectorId_fkey";

-- AlterTable
ALTER TABLE "Inspection" ALTER COLUMN "inspectorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_inspectorId_fkey" FOREIGN KEY ("inspectorId") REFERENCES "ProfessionalProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
