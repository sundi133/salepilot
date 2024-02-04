-- CreateTable
CREATE TABLE "InterviewQuestionsMedia" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "audioLink" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewQuestionsMedia_pkey" PRIMARY KEY ("id")
);
