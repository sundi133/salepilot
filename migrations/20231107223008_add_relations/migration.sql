-- CreateTable
CREATE TABLE "Invitations" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "interviewId" INTEGER NOT NULL,
    "pinCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
