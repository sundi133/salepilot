/*
  Warnings:

  - Added the required column `creatorEmail` to the `Candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorName` to the `Candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorEmail` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorName` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidates" ADD COLUMN     "creatorEmail" TEXT NOT NULL,
ADD COLUMN     "creatorName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "creatorEmail" TEXT NOT NULL,
ADD COLUMN     "creatorName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationUser" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "orgId" INTEGER NOT NULL,

    CONSTRAINT "OrganizationUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationUser_userId_orgId_key" ON "OrganizationUser"("userId", "orgId");

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
