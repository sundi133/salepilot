/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "createdBy",
ADD COLUMN     "creatorEmail" TEXT,
ADD COLUMN     "creatorName" TEXT;
