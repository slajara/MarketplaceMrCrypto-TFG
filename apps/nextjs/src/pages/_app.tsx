// Imports
// ========================================================
import "../styles/globals.css";

import { type AppType } from "next/app";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
// SIWE Integration
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { api } from "~/utils/api";
import { AuthSIWEProvider } from "../utils/siweClient";

// Config
// =======================================================

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({
      apiKey: "mJzTdEVWjXiMNFtQ5635WnKkJu-1GR1w",
    }),
  ],
);

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.PROVIDER_URL_MUMBAI, // or infuraId
    walletConnectProjectId: "",

    // Required
    appName: "MrCryptoE7LMarketplace",
    chains,
    autoConnect: true,
    publicClient,
    // Optional
    // appDescription: "The Mr.Crypto marketplace with E7L integration",
    // appUrl: "https://MrCrypto.Marketplace.co", // your app's url
    // appIcon: "/mrcrypto2.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

// App Wrapper Component
// ========================================================
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <WagmiConfig config={config}>
        <AuthSIWEProvider>
          <ConnectKitProvider>
            <Component {...pageProps} />
          </ConnectKitProvider>
        </AuthSIWEProvider>
      </WagmiConfig>
    </SessionProvider>
  );
};

// Exports
// ========================================================
export default api.withTRPC(MyApp);
