/*
  Warnings:

  - Added the required column `orgId` to the `InterviewQuestionsMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `SummarizedFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Candidates" DROP CONSTRAINT "Candidates_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Invitations" DROP CONSTRAINT "Invitations_orgId_fkey";

-- AlterTable
ALTER TABLE "Candidates" ALTER COLUMN "orgId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Interview" ALTER COLUMN "orgId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "InterviewQuestionsMedia" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invitations" ALTER COLUMN "orgId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SummarizedFeedback" ADD COLUMN     "orgId" TEXT NOT NULL;
