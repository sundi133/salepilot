/*
  Warnings:

  - You are about to drop the column `role` on the `OrganizationUser` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orgId` to the `Candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgRole` to the `OrganizationUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgSlug` to the `OrganizationUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizationUser" DROP CONSTRAINT "OrganizationUser_orgId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationUser" DROP CONSTRAINT "OrganizationUser_userId_fkey";

-- DropIndex
DROP INDEX "OrganizationUser_userId_orgId_key";

-- AlterTable
ALTER TABLE "Candidates" ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Invitations" ADD COLUMN     "orgId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationUser" DROP COLUMN "role",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orgRole" TEXT NOT NULL,
ADD COLUMN     "orgSlug" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userEmail" TEXT,
ADD COLUMN     "userFirstName" TEXT,
ADD COLUMN     "userLastName" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "orgId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "User";

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "OrganizationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidates" ADD CONSTRAINT "Candidates_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "OrganizationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "OrganizationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
