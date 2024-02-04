-- AlterTable
ALTER TABLE "EmailEvent" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "maxWords" INTEGER;
