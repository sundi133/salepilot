-- CreateTable
CREATE TABLE "SummarizedFeedback" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "summaryText" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SummarizedFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SummarizedFeedback" ADD CONSTRAINT "SummarizedFeedback_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SummarizedFeedback" ADD CONSTRAINT "SummarizedFeedback_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
