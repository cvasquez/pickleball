import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoggedInLayout from '../../layouts/LoggedIn';

function DrillPage() {
    const router = useRouter();
    const { id } = router.query;
    const [drill, setDrill] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchDrill = async () => {
                const response = await fetch(`/api/drills?id=${id}`);
                const drillData = await response.json();
                setDrill(drillData);
            };
            fetchDrill();
        }
    }, [id]);

    if (!drill) {
        return <div>Loading...</div>;
    }

    return (
        <LoggedInLayout>
            <Link href={`/Drills`}>back...</Link>
            <h1>{drill.title}</h1>
            <div>Status: {drill.status}</div>
            <div dangerouslySetInnerHTML={{ __html: drill.content }}></div>
        </LoggedInLayout>
    );
}

export default DrillPage;
