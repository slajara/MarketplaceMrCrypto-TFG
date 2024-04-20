// Imports
// ========================================================
import { type NextPage } from "next";
import Head from "next/head";

import Events from "../components/Events";
import FindUs from "../components/FindUs";
import Hero from "../components/Hero";
import LastCollectionE7L from "../components/LastCollectionE7L";
import MainLayout from "../components/layouts/MainLayout";
import LiveAuction from "../components/LiveAuction";
import MrCryptoInfo from "../components/MrCryptoInfo";
import TopHolders from "../components/TopHolders";

const Home: NextPage = () => {
  // Render
  return (
    <>
      <Head>
        <title>E7L Marketplace</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/disrup3.png" />
      </Head>

      <MainLayout>
        <Hero />
        <MrCryptoInfo />
        <LastCollectionE7L />
        <TopHolders />
        <LiveAuction />
        <FindUs />
        <Events />
      </MainLayout>
    </>
  );
};

// Exports
// ========================================================
export default Home;
