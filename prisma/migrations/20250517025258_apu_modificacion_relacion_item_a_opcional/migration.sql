-- DropForeignKey
ALTER TABLE "Apu" DROP CONSTRAINT "Apu_itemId_fkey";

-- AlterTable
ALTER TABLE "Apu" ALTER COLUMN "itemId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Apu" ADD CONSTRAINT "Apu_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
