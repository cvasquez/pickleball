/*
  Warnings:

  - You are about to drop the column `player1Team1` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player1Team2` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Team1` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `player2Team2` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `team1Name` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `team2Name` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `_CommentLikes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `team1Id` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team2Id` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CommentLikes" DROP CONSTRAINT "_CommentLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentLikes" DROP CONSTRAINT "_CommentLikes_B_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "player1Team1",
DROP COLUMN "player1Team2",
DROP COLUMN "player2Team1",
DROP COLUMN "player2Team2",
DROP COLUMN "team1Name",
DROP COLUMN "team2Name",
ADD COLUMN     "team1Id" TEXT NOT NULL,
ADD COLUMN     "team2Id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CommentLikes";

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "names" TEXT[],

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateTable
CREATE TABLE "Like" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("userId","commentId")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
