-- AlterTable
ALTER TABLE "Drill" ADD COLUMN     "numberPlayers" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "skillLevel" TEXT NOT NULL DEFAULT 'beginner';
