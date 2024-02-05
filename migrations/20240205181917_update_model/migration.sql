/*
  Warnings:

  - Added the required column `creatorEmail` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creatorEmail" TEXT NOT NULL,
ADD COLUMN     "creatorName" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;
