-- AlterTable
ALTER TABLE "EmailEvent" ALTER COLUMN "eventTime" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "tone" TEXT;
