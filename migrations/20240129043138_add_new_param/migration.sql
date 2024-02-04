-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "isPractice" BOOLEAN,
ADD COLUMN     "maximumPracticeAttempts" INTEGER;

-- AlterTable
ALTER TABLE "InterviewQuestionsMedia" ADD COLUMN     "isCoding" BOOLEAN,
ADD COLUMN     "timeAllocatedSeconds" INTEGER;
