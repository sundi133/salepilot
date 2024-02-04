/*
  Warnings:

  - You are about to drop the `CampaignContact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CampaignContact" DROP CONSTRAINT "CampaignContact_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignContact" DROP CONSTRAINT "CampaignContact_contactId_fkey";

-- DropTable
DROP TABLE "CampaignContact";
