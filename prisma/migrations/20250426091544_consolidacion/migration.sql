/*
  Warnings:

  - Changed the type of `status` on the `Inspection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusInspection" AS ENUM ('SOLICITADO', 'PENDIENTE', 'FINALIZADO');

-- AlterTable
ALTER TABLE "Inspection" DROP COLUMN "status",
ADD COLUMN     "status" "StatusInspection" NOT NULL;

-- CreateTable
CREATE TABLE "InspectionReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closeAt" TIMESTAMP(3) NOT NULL,
    "ownerSignature" TEXT NOT NULL,
    "inspectionId" TEXT NOT NULL,

    CONSTRAINT "InspectionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "photo" TEXT,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "inspectionReportId" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Apu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApuCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apuId" TEXT NOT NULL,

    CONSTRAINT "ApuCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApuDetail" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "yield" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "apuCategoryId" TEXT NOT NULL,
    "unitApuId" TEXT NOT NULL,

    CONSTRAINT "ApuDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitApu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UnitApu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InspectionReport_inspectionId_key" ON "InspectionReport"("inspectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Apu_itemId_key" ON "Apu"("itemId");

-- AddForeignKey
ALTER TABLE "InspectionReport" ADD CONSTRAINT "InspectionReport_inspectionId_fkey" FOREIGN KEY ("inspectionId") REFERENCES "Inspection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_inspectionReportId_fkey" FOREIGN KEY ("inspectionReportId") REFERENCES "InspectionReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apu" ADD CONSTRAINT "Apu_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apu" ADD CONSTRAINT "Apu_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApuCategory" ADD CONSTRAINT "ApuCategory_apuId_fkey" FOREIGN KEY ("apuId") REFERENCES "Apu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApuDetail" ADD CONSTRAINT "ApuDetail_apuCategoryId_fkey" FOREIGN KEY ("apuCategoryId") REFERENCES "ApuCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApuDetail" ADD CONSTRAINT "ApuDetail_unitApuId_fkey" FOREIGN KEY ("unitApuId") REFERENCES "UnitApu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
