-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "creatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
