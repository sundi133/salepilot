-- CreateTable
CREATE TABLE "Interview" (
    "id" SERIAL NOT NULL,
    "interviewerId" TEXT NOT NULL,
    "jobRoleName" TEXT NOT NULL,
    "jobLink" TEXT,
    "interviewQuestions" TEXT NOT NULL,
    "durationInMinutes" INTEGER NOT NULL,
    "interviewType" TEXT NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);
