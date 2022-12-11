import { useState } from "react";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { chain, createClient, configureChains } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

interface UseWagmiClientArgs {
  enableTestnets: string;
  apiKey: string;
}

export function useWagmiClient({ enableTestnets, apiKey }: UseWagmiClientArgs) {
  // Remix modules cannot have side effects so the initialization of `wagmi`
  // client happens during render, but the result is cached via `useState`
  // and a lazy initialization function.
  // See: https://remix.run/docs/en/v1/guides/constraints#no-module-side-effects
  const [{ client, chains }] = useState(() => {
    const testChains = enableTestnets === "true" ? [chain.goerli] : [];

    const { chains, provider } = configureChains(
      [
        chain.mainnet,
        chain.polygon,
        chain.optimism,
        chain.arbitrum,
        ...testChains,
      ],
      [alchemyProvider({ apiKey }), publicProvider()]
    );

    const { connectors } = getDefaultWallets({
      appName: "RainbowKit Remix Example",
      chains,
    });

    const client = createClient({
      provider,
      connectors,
      autoConnect: true,
    });

    return { client, chains };
  });

  return { client, chains };
}
