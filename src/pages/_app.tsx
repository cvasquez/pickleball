import { SessionProvider } from 'next-auth/react';
import '@mantine/core/styles.css';
import {
    MantineProvider,
    Container } from '@mantine/core';
import { AppProps } from 'next/app'

function PickleballApp({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider>
            <Container size="30rem">
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
            </SessionProvider>
            </Container>
        </MantineProvider>
    )
}

export default PickleballApp