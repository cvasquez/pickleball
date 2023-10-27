import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { method, query } = req;

    switch (method) {
        // Create a new drill
        case 'POST':
            try {
                const { title, status, content } = req.body;
                const newDrill = await prisma.drill.create({
                    data: {
                        title,
                        status,
                        content,
                    },
                });
                res.status(201).json(newDrill);
            } catch (error) {
                res.status(400).json({ error: `Failed to create drill: ${error.message}` });
            }
            break;

        case 'GET':
            try {
                const { id } = query;

                // Get a single drill by ID
                if (id) {
                    const drill = await prisma.drill.findUnique({
                        where: { id: parseInt(id, 10) },
                    });

                    if (!drill) {
                        return res.status(404).json({ error: 'Drill not found' });
                    }

                    return res.status(200).json(drill);
                }

                // Get all drills
                const drills = await prisma.drill.findMany({
                    where: {
                        status: 'published',
                    },
                });
                res.status(200).json(drills);
            } catch (error) {
                console.error("API Error", error);
                res.status(400).json({ error: `Failed to fetch drills: ${error.message}` });
            }
            break;


        // Update a drill by id
        case 'PUT':
            try {
                const { id, title, status, content } = req.body;
                const updatedDrill = await prisma.drill.update({
                    where: { id },
                    data: { title, status, content },
                });
                res.status(200).json(updatedDrill);
            } catch (error) {
                res.status(400).json({ error: `Failed to update drill: ${error.message}` });
            }
            break;

        // Delete a drill by id
        case 'DELETE':
            try {
                const { id } = req.body;
                const deletedDrill = await prisma.drill.delete({ where: { id } });
                res.status(200).json(deletedDrill);
            } catch (error) {
                res.status(400).json({ error: `Failed to delete drill: ${error.message}` });
            }
            break;

        default:
            res.status(405).end();
            break;
    }
}