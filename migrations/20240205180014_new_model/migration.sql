-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "apolloData" JSONB;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT,
    "apolloData" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
