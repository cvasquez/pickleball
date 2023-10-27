import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Badge } from '@mantine/core';
import Link from 'next/link';
import LoggedInLayout from '../layouts/LoggedIn';

function Drills() {
    const { data: session } = useSession();
    const [drills, setDrills] = useState([]);

    useEffect(() => {
        if (session && session.user) {
            const fetchDrills = async () => {
                const response = await fetch(`/api/drills`);
                const drillsData = await response.json();
                setDrills(drillsData);
            };
            fetchDrills();
        }

        console.log(drills);
    }, [session]);

    // Ensure the page is only accessible to logged-in users
    if (!session) {
        return <div>Please sign in to create a game.</div>;
    }

    return (
        <LoggedInLayout>
            {drills.map((drill) => (
                <div key={drill.id}>
                    <h1>
                        <Link href={`/drill/${drill.id}`}>
                            {drill.title}
                        </Link>
                    </h1>
                    <Badge variant='outline' mr='xs'>{drill.skillLevel}</Badge>
                    <Badge variant='outline'>{drill.numberPlayers} {drill.numberPlayers != 1 ? 'players' : 'player'}</Badge>
                    <div dangerouslySetInnerHTML={{ __html: drill.summary }}></div>
                </div>
            ))}
        </LoggedInLayout>
    )
}

export default Drills