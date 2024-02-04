/*
  Warnings:

  - Made the column `audio_question_link` on table `Evaluation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `audio_question_text` on table `Evaluation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "audio_question_link" SET NOT NULL,
ALTER COLUMN "audio_question_text" SET NOT NULL;
