/*
  Warnings:

  - Added the required column `invitationId` to the `Invitations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitations" ADD COLUMN     "invitationId" TEXT NOT NULL;
