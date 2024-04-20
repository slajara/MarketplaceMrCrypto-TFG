import React from "react";

import { api } from "~/utils/api";
import BackgroundElement from "./BackgroundElement";
import CardHolder from "./CardHolder";

const TopHolders = () => {
  const getTopHolders = api.queriesE7L.getTopHolders.useQuery({
    range: 12,
  }).data;

  return (
    <>
      <div className="mx-auto mt-20 text-light" id="topHolders">
        <h2 className="mb-5 text-center text-2xl font-bold">Top Holders</h2>
        <div className="flex justify-center">
          <div className=" grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {getTopHolders?.topHolders &&
              getTopHolders?.topHolders.map((holder, index) => (
                <CardHolder
                  key={index + 1}
                  addressHolder={holder.address}
                  position={index + 1}
                  imageURL="/MrCrypto-8141.png"
                  numberOfMRC={holder.numberOfMrCryptos}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="z-0">
        <BackgroundElement shape="circle" position="right" marginTop="-200px" />
      </div>
    </>
  );
};

export default TopHolders;
