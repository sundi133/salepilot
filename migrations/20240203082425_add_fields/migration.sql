/*
  Warnings:

  - Added the required column `eventContent` to the `EmailEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailEvent" ADD COLUMN     "eventContent" TEXT NOT NULL;
