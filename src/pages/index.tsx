import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoggedInLayout from '../layouts/LoggedIn';
import Link from 'next/link';
import { Button, Textarea } from '@mantine/core';
import {
    MdDeleteForever
} from "react-icons/md";

function HomePage() {
    const { data: session } = useSession();
    const [user, setUser] = useState([]);
    const [games, setGames] = useState([]);
    const [comments, setComments] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [newComment, setNewComment] = useState('');

    const addComment = async () => {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newComment, userId: user.id }),
        });

        if (response.ok) {
            const commentData = await response.json();
            setActivityFeed([commentData, ...activityFeed]);
            setNewComment('');
        }
    };

    const deleteComment = async (commentId) => {
        try {
            const res = await fetch(`/api/comments?id=${commentId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Remove the deleted comment from state or refetch comments
                setActivityFeed(activityFeed.filter(item => item.id !== commentId));
            } else {
                console.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('An error occurred while deleting the comment:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (session && session.user && session.user.email) {
                const email = session.user.email;

                const [userResponse, gamesResponse, commentsResponse] = await Promise.all([
                    fetch(`/api/users?email=${email}`),
                    fetch(`/api/games?email=${email}`),
                    fetch(`/api/comments?email=${email}`)
                ]);

                const [userData, gamesData, commentsData] = await Promise.all([
                    userResponse.json(),
                    gamesResponse.json(),
                    commentsResponse.json()
                ]);

                setUser(userData);
                setGames(gamesData);
                setComments(commentsData);

                // Combine and sort games and comments by createdDate
                const combined = [...gamesData, ...commentsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setActivityFeed(combined);
            }
        }

        fetchData();
    }, [session]);

    return (
        <>
            {!session ? (
                <>
                    Pickleball App<br />
                    <Button onClick={() => signIn()}>Sign in</Button>
                </>
            ) : (
                <LoggedInLayout>
                    Hi {user.displayName}!
                    <h2>Your Feed</h2>

                    <Textarea
                        placeholder="Write your new comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.currentTarget.value)}
                    />
                    <Button onClick={addComment}>Add Comment</Button>
                    <Button
                        component={Link}
                        href="/NewGame"
                    >
                        New Game
                    </Button>

                    <ul>
                        {activityFeed.map((item, index) => (
                            <li key={index}>
                                {item.dateTime ? (
                                    `${item.dateTime} @ ${item.location} - ${item.team1Name} (${item.scoreTeam1}) vs ${item.team2Name} (${item.scoreTeam2})`
                                ) : (
                                    <>
                                        {item.user ? `${item.content} - ${item.user.displayName} @ ${item.createdAt}` : `Loading...`}
                                        <Button
                                            variant='transparent'
                                            size="compact-lg"
                                            color="red"
                                            onClick={() => deleteComment(item.id)}
                                        >
                                            <MdDeleteForever />
                                        </Button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </LoggedInLayout>
            )}
        </>
    )
}

export default HomePage