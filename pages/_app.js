import "../styles/globals.css";
import { useRouter } from "next/router";
import { store } from "store/store";
import { Provider } from "react-redux";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "helpers/errors/ErrorBoundary";
import GlobalStatesProvider from "@modules/layout/components/base/globalStatesProvider";
import Head from "next/head";
import Layout from "@modules/layout/components/base/layout";
import { StrictMode } from "react";

function MyApp({ Component, pageProps, router }) {
    const r = useRouter();

    return (
        <StrictMode>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Provider store={store}>
                    <GlobalStatesProvider>
                        <Head>
                            <title>flate.pro</title>
                            <meta
                                name="apple-itunes-app"
                                content="app-id=6458738854"
                            />
                            <meta
                                name="viewport"
                                content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
                            />
                            <link
                                rel="apple-touch-icon"
                                sizes="180x180"
                                href="/favicon.svg"
                            />
                            <link
                                rel="icon"
                                type="image/png"
                                sizes="60x60"
                                href="/favicon.svg"
                            />
                            <link
                                rel="icon"
                                type="image/png"
                                sizes="16x16"
                                href="/favicon.svg"
                            />
                            <link rel="manifest" href="/manifest.json" />
                        </Head>

                        {r.asPath === "/user/profile/auth" ? (
                            <Component {...pageProps} key={router.pathname} />
                        ) : r.asPath === "/hello" ? (
                            <Component {...pageProps} key={router.pathname} />
                        ) : (
                            <Layout {...pageProps}>
                                <Component {...pageProps} key={router.pathname} />
                            </Layout>
                        )}
                    </GlobalStatesProvider>
                </Provider>
            </ErrorBoundary>
        </StrictMode>
    );
}

export function ErrorFallback() {
    return <div>ErrorFallback</div>;
}

export default MyApp;
