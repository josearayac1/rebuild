/*
  Warnings:

  - You are about to drop the column `needsBudget` on the `Inspection` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Inspection` table. All the data in the column will be lost.
  - The `status` column on the `Inspection` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `surface` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `terrace` on the `Property` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `Inspection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `communeId` to the `Inspection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regionId` to the `Inspection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estateCompany` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estateProject` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `innerArea` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitNumber` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inspection" DROP COLUMN "needsBudget",
DROP COLUMN "updatedAt",
ADD COLUMN     "cityId" TEXT NOT NULL,
ADD COLUMN     "communeId" TEXT NOT NULL,
ADD COLUMN     "regionId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "surface",
DROP COLUMN "terrace",
ADD COLUMN     "estateCompany" TEXT NOT NULL,
ADD COLUMN     "estateProject" TEXT NOT NULL,
ADD COLUMN     "innerArea" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "terraceArea" DOUBLE PRECISION,
ADD COLUMN     "unitNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection" ADD CONSTRAINT "Inspection_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
