import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { method, query } = req;

  switch (method) {
    // Create a new game
    case 'POST':
      try {
        const { creatorId, dateTime, location, team1Id, team1Name, team2Id, team2Name } = req.body;


        // Make sure the creator user actually exists
        const user = await prisma.user.findUnique({
          where: { id: creatorId },
        });

        if (!user) {
          return res.status(400).json({ error: 'User not found' });
        }

        // Initialize Team IDs
        let finalTeam1Id = team1Id;
        let finalTeam2Id = team2Id;

        // Create or use existing Teams
        if (!team1Id && team1Name) {
          const newTeam1 = await prisma.team.create({
            data: { name: team1Name },
          });
          finalTeam1Id = newTeam1.id;
        }

        if (!team2Id && team2Name) {
          const newTeam2 = await prisma.team.create({
            data: { name: team2Name },
          });
          finalTeam2Id = newTeam2.id;
        }

        const newGame = await prisma.game.create({
          data: {
            creator: {
              connect: { id: creatorId }
            },
            dateTime,
            location,
            team1: finalTeam1Id ? {
              connect: { id: finalTeam1Id },
            } : undefined,
            team2: finalTeam2Id ? {
              connect: { id: finalTeam2Id },
            } : undefined,
          }
        });

        res.status(201).json(newGame);

      } catch (error) {
        res.status(400).json({ error: `Failed to create game: ${error.message}` });
      }
      break;

    case 'GET':
      try {
        const { id, email } = req.query;

        // Get an individual game by the game id
        if (id) {
          const game = await prisma.game.findUnique({
            where: {
              id: String(id)
            },
          });

          if (!game) {
            return res.status(404).json({ error: 'Game not found' });
          }
          return res.status(200).json(game);
        }

        // Get all games by user email
        if (email) {
          const games = await prisma.game.findMany({
            where: {
              creator: {
                email: String(email),
              },
            },
          });
          return res.status(200).json(games);
        }

        // Error if missing query parameter
        res.status(400).json({ error: 'Please provide a valid query parameter' });
      } catch (error) {
        console.error("API Error", error);
        res.status(400).json({ error: `Failed to fetch games: ${error.message}` });
      }
      break;

    case 'PUT':
      try {
        const updatedGame = await prisma.game.update({
          where: { id: String(req.body.id) },
          data: req.body,
        });
        res.status(200).json(updatedGame);
      } catch (error) {
        res.status(400).json({ error: `Failed to update game: ${error.message}` });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        console.log('Deleting game with id:', id);

        const game = await prisma.game.findUnique({
          where: { id: String(id) },
        });

        if (!game) {
          return res.status(404).json({ error: 'Game not found' });
        }

        // Delete the game
        const deletedGame = await prisma.game.delete({
          where: { id: String(id) },
        });
        res.status(200).json(deletedGame);
      } catch (error) {
        console.error("API Error", error);
        res.status(400).json({ error: `Failed to delete game: ${error.message}` });
      }
      break;

    default:
      res.status(405).end(); // Method not allowed
      break;
  }
}
