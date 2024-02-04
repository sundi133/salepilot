/*
  Warnings:

  - Added the required column `followUpDepth` to the `InterviewQuestionsMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InterviewQuestionsMedia" ADD COLUMN     "followUpDepth" INTEGER NOT NULL;
