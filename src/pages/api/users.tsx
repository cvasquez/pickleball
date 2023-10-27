import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
    const { method, query, body } = req;

    switch (method) {
        case 'POST':
            try {
                const newUser = await prisma.user.create({
                    data: body,
                });
                return res.status(201).json(newUser);
            } catch (error) {
                res.status(400).json({ error: `Failed to create user: ${error.message}` });
            }

        case 'GET':
            try {
                const { email } = query;

                // Get an individual user by email
                if (email) {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: String(email),
                        },
                    });

                    if (!user) {
                        return res.status(404).json({ error: 'User not found' });
                    }

                    return res.status(200).json(user);
                }

                // Get all users
                const users = await prisma.user.findMany();
                return res.status(200).json(users);

            } catch (error) {
                res.status(400).json({ error: `Failed to fetch users: ${error.message}` });
            }

        case 'PUT':
            try {
                const updatedUser = await prisma.user.update({
                    where: { email: String(body.email) },
                    data: body,
                });
                return res.status(200).json(updatedUser);
            } catch (error) {
                res.status(400).json({ error: `Failed to update user: ${error.message}` });
            }

        case 'DELETE':
            try {
                const deletedUser = await prisma.user.delete({
                    where: { id: String(body.id) },
                });
                return res.status(200).json(deletedUser);
            } catch (error) {
                res.status(400).json({ error: `Failed to delete user: ${error.message}` });
            }

        default:
            return res.status(405).end(); // Method Not Allowed
    }
}
