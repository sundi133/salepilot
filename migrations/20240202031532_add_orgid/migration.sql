/*
  Warnings:

  - Added the required column `orgId` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `CampaignContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `CampaignMetric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `EmailEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "CampaignContact" ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "CampaignMetric" ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "EmailEvent" ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "orgId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;
