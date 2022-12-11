import { useReducer } from "react";
import { generateNonce } from "siwe";
import { WagmiConfig } from "wagmi";
import { json } from "@remix-run/node";
import {
  ConnectButton,
  RainbowKitProvider,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import {
  Meta,
  Links,
  Outlet,
  Scripts,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
} from "@remix-run/react";
import { getSession } from "./utils/session.server";
import { useSiweSync, useWagmiClient } from "./hooks";
import { reducer, initialState } from "./state/reducer";
import { getAuthenticationAdapter } from "./utils/getAuthenticationAdapter";
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import globalStylesUrl from "./styles/global.css";
import rainbowStylesUrl from "@rainbow-me/rainbowkit/styles.css";

type Env = { ALCHEMY_API_KEY?: string; PUBLIC_ENABLE_TESTNETS?: string };

type LoaderData = { nonce: string; ENV: Env };

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "RainbowKit Remix SIWE Example",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet", href: rainbowStylesUrl },
];

export const loader: LoaderFunction = async ({ request }) => {
  console.log(process.env.ALCHEMY_API_KEY,'<---process.env.ALCHEMY_API_KEY')
  const nonce = generateNonce();
  const session = await getSession(request);
  session.setNonce(nonce);
  const data: LoaderData = {
    nonce,
    ENV: {
      ALCHEMY_API_KEY:
        process.env.ALCHEMY_API_KEY || "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
      PUBLIC_ENABLE_TESTNETS: process.env.PUBLIC_ENABLE_TESTNETS || "false",
    },
  };

  return json(data, { headers: { "Set-Cookie": await session.commit() } });
};

export default function App() {
  const { ENV, nonce } = useLoaderData<LoaderData>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { client, chains } = useWagmiClient({
    enableTestnets: ENV.PUBLIC_ENABLE_TESTNETS || "false",
    apiKey: ENV.ALCHEMY_API_KEY || "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  });

  useSiweSync({ dispatch });

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {client && chains ? (
          <WagmiConfig client={client}>
            <RainbowKitAuthenticationProvider
              adapter={getAuthenticationAdapter(nonce, dispatch)}
              status={state.authenticationStatus}
            >
              <RainbowKitProvider chains={chains}>
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <ConnectButton />
                </div>
              </RainbowKitProvider>
            </RainbowKitAuthenticationProvider>
            <h1>Status: {state.authenticationStatus}</h1>
            <Outlet context={{ state, dispatch }} />
          </WagmiConfig>
        ) : null}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
