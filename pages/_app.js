import "../styles/globals.css";
import { useRouter } from "next/router";
import { store } from "store/store";
import { Provider } from "react-redux";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "helpers/errors/ErrorBoundary";
import GlobalStatesProvider from "@modules/layout/components/base/globalStatesProvider";
import Head from "next/head";
import Layout from "@modules/layout/components/base/layout";
function MyApp({ Component, pageProps, router }) {
  const r = useRouter();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <GlobalStatesProvider>
          <Head>
            <title>flate.pro</title>
            <meta name="apple-itunes-app" content="app-id=6458738854" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/favicon-(60x60).png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="60x60"
              href="/favicon-(60x60).png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-(16x16).png"
            />
            <link rel="manifest" href="/manifest.json" />
          </Head>

          {r.asPath === "/user/profile/auth" ? (
            <AnimatePresence>
              <Component {...pageProps} key={router.pathname} />
            </AnimatePresence>
          ) : (
            <Layout {...pageProps}>
              <AnimatePresence>
                <Component {...pageProps} key={router.pathname} />
              </AnimatePresence>
            </Layout>
          )}
        </GlobalStatesProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export function ErrorFallback() {
  return <div>ErrorFallback</div>;
}

export default MyApp;
