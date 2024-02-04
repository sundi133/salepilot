/*
  Warnings:

  - Added the required column `invitationId` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "invitationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
