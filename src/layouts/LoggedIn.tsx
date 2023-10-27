import { signOut } from 'next-auth/react';
import Link from 'next/link';
import {
    AppShell,
    Button,
    Group,
    Tooltip,
} from '@mantine/core';
import {
    MdHome,
    MdLogout,
    MdSchool,
    MdSettings
} from "react-icons/md";

const LoggedInLayout: React.FC = ({ children }) => {
    return (
        <AppShell
            header={{ height: 50 }}
            padding="md"
        >
            <AppShell.Header>
                <Group justify="center">
                    <Tooltip label="Home">
                        <Button
                            variant="transparent"
                            size="compact-xl"
                            component={Link}
                            href="/"
                        >
                            <MdHome />
                        </Button>
                    </Tooltip>
                    <Tooltip label="Drills">
                        <Button
                            variant="transparent"
                            size="compact-xl"
                            component={Link}
                            href="/Drills"
                        >
                            <MdSchool />
                        </Button>
                    </Tooltip>
                    <Tooltip label="Settings">
                        <Button
                            variant="transparent"
                            size="compact-xl"
                            component={Link}
                            href="/Settings"
                        >
                            <MdSettings />
                        </Button>
                    </Tooltip>
                    <Tooltip label="Logout">
                        <Button
                            variant="transparent"
                            size="compact-xl"
                            onClick={() => signOut()}
                        >
                            <MdLogout />
                        </Button>
                    </Tooltip>
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}

export default LoggedInLayout;