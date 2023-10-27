import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req, res) {
    const { method, query } = req;

    switch (method) {
        case 'POST':
            // Create new comment
            try {
                const newComment = await prisma.comment.create({
                    data: req.body,
                    include: {
                        user: true
                    },
                });
                res.status(201).json(newComment);
            } catch (error) {
                res.status(400).json({ error: `Unable to create comment: ${error.message}` });
            }
            break;

        case 'GET':
            const { email, id, parentId, gameId } = query;

            // Get all comments
            if (!email && !id && !parentId && !gameId) {
                try {
                    const allComments = await prisma.comment.findMany({
                        include: {
                            user: true
                        }
                    });
                    res.status(200).json(allComments);
                } catch (error) {
                    res.status(500).json({ error: `Unable to get all comments: ${error.message}` });
                }
                return;
            }

            // Get comments by user by email
            if (email) {
                try {
                    const userComments = await prisma.comment.findMany({
                        where: {
                            user: {
                                email: email,
                            },
                        },
                        include: {
                            user: true
                        }
                    });
                    res.status(200).json(userComments);
                } catch (error) {
                    res.status(500).json({ error: `Unable to get comments by email: ${error.message}` });
                }
                return;
            }

            // Get a comment by ID
            if (id) {
                try {
                    const comment = await prisma.comment.findUnique({
                        where: {
                            id: id,
                        },
                    });

                    if (!comment) {
                        res.status(404).json({ error: 'Comment not found' });
                        return;
                    }

                    res.status(200).json(comment);
                } catch (error) {
                    res.status(500).json({ error: `Unable to get comment by ID: ${error.message}` });
                }
                return;
            }

            // Get replies by parent id
            if (parentId) {
                try {
                    const replyComments = await prisma.comment.findMany({
                        where: {
                            parentId: parentId,
                        },
                    });
                    res.status(200).json(replyComments);
                } catch (error) {
                    res.status(500).json({ error: `Unable to get comments by parentId: ${error.message}` });
                }
                return;
            }

            // Get comments by game id
            if (gameId) {
                try {
                    const gameComments = await prisma.comment.findMany({
                        where: {
                            gameId: gameId,
                        },
                    });
                    res.status(200).json(gameComments);
                } catch (error) {
                    res.status(500).json({ error: `Unable to get comments by gameId: ${error.message}` });
                }
                return;
            }

            break;

        case 'PUT':
            // Update existing comment
            try {
                if (!query.id) {
                    res.status(400).json({ error: 'Comment ID is required for updating' });
                    return;
                }
                const updatedComment = await prisma.comment.update({
                    where: { id: query.id },
                    data: body,
                });
                res.status(200).json(updatedComment);
            } catch (error) {
                res.status(400).json({ error: `Unable to update comment: ${error.message}` });
            }
            break;

        case 'DELETE':
            // Delete a comment
            try {
                if (!query.id) {
                    res.status(400).json({ error: 'Comment ID is required for deletion' });
                    return;
                }
                await prisma.comment.delete({
                    where: { id: query.id },
                });
                res.status(200).json({ message: 'Comment deleted successfully' });
            } catch (error) {
                res.status(400).json({ error: `Unable to delete comment: ${error.message}` });
            }
            break;

        default:
            res.status(405).end();
            break;
    }
}