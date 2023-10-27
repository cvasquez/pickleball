-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('AROUND_THE_POST', 'ERNE', 'GOLDEN_PICKLE', 'GOOD_GAME', 'COMEBACK');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "team1Name" TEXT NOT NULL DEFAULT 'Team 1',
    "team2Name" TEXT NOT NULL DEFAULT 'Team 2',
    "player1Team1" TEXT NOT NULL DEFAULT 'Player 1',
    "player2Team1" TEXT NOT NULL DEFAULT 'Player 2',
    "player1Team2" TEXT NOT NULL DEFAULT 'Player 2',
    "player2Team2" TEXT NOT NULL DEFAULT 'Player 4',
    "scoreTeam1" INTEGER NOT NULL,
    "scoreTeam2" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "type" "AchievementType" NOT NULL,
    "player" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
