-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "audio_url" TEXT,
ALTER COLUMN "video_url" DROP NOT NULL;
