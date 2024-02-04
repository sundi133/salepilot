/*
  Warnings:

  - Added the required column `campaignType` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "tags" TEXT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "campaignType" TEXT NOT NULL;
