import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    Group,
    Paper,
    Input,
    Button,
    SegmentedControl,
} from '@mantine/core';
import {
    DateTimePicker
} from '@mantine/dates'
import '@mantine/dates/styles.css';
import LoggedInLayout from '../layouts/LoggedIn';

const NewGame = () => {
    const [creatorId, setCreatorId] = useState(null);
    const [gameType, setGameType] = useState('1v1');
    const [team1Name, setTeam1Name] = useState('');
    const [team2Name, setTeam2Name] = useState('');
    const [formData, setFormData] = useState({
        creatorId: null,
        creator: null,
        dateTime: null,
        location: '',
        team1: ['', ''],
        team2: ['', ''],
    });
    const { data: session } = useSession();

    useEffect(() => {
        const fetchCreatorId = async () => {
            try {
                if (session && session.user && session.user.email) {
                    const email = session.user.email;
                    const response = await fetch(`/api/users?email=${email}`);
                    const data = await response.json();
                    console.log("API response:", data);

                    if (data && data.id) {
                        setCreatorId(data.id);
                        setFormData(prevFormData => ({ ...prevFormData, creator: data.id, creatorId: data.id }));
                        console.log(formData);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch creatorId:", error);
            }
        };
        fetchCreatorId();
    }, [session]);

    const handleInputChange = (event, teamIndex, playerIndex) => {
        const { name, value } = event.target;

        if (name.startsWith('team')) {
            // Copy existing formData
            const newTeams = { ...formData };

            // Update the specific player in the team array
            newTeams[name][playerIndex] = value;

            // Update the formData state
            setFormData(newTeams);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        console.log('Submitting form with data:', formData);
        e.preventDefault();
        const payload = {
            ...formData,
            team1Id: formData.team1Id || null,
            team1Name: team1Name || null,
            team2Id: formData.team2Id || null,
            team2Name: team2Name || null,
        };

        try {
            const response = await fetch('/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json(); // Parse the JSON response

            if (response.ok) {
                console.log('Successfully created game:', result);
            } else {
                console.log('Failed to create game:', result);
            }
        } catch (error) {
            console.error(`Failed to create game: ${error.message}`)
        }
    };

    const renderPlayerInputs = (team, teamIndex) => {
        const numPlayers = gameType === '1v1' ? 1 : 2;
        return Array.from({ length: numPlayers }, (_, i) => (
            <Input
                key={i}
                label={`Player ${i + 1}`}
                placeholder={`Enter name of Player ${i + 1}`}
                name={`team${teamIndex}`}
                value={formData[`team${teamIndex}`][i] || ''}
                onChange={(e) => handleInputChange(e, teamIndex, i)}
            />
        ));
    };

    return (
        <LoggedInLayout>
            <Paper padding="md" style={{ maxWidth: 400, margin: 'auto' }}>
                <Group direction="column" spacing="md">
                    <SegmentedControl
                        data={['1v1', '2v2']}
                        value={gameType}
                        onChange={setGameType}
                    />
                    <DateTimePicker
                        label="Date and Time"
                        placeholder="Select date and time"
                        value={formData.dateTime}
                        onChange={(value) => setFormData({ ...formData, dateTime: value })}
                    />
                    <Input
                        label="Location"
                        placeholder="Enter game location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                    <Group direction="column" spacing="xs">
                        <h4>Team 1</h4>
                        {renderPlayerInputs('team1', 1)}
                    </Group>
                    <Group direction="column" spacing="xs">
                        <h4>Team 2</h4>
                        {renderPlayerInputs('team2', 2)}
                    </Group>
                    <Button onClick={handleSubmit}>Create Game</Button>
                </Group>
            </Paper>
        </LoggedInLayout>
    );
};

export default NewGame;
