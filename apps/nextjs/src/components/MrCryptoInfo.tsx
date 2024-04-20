import React from "react";

import { api } from "~/utils/api";

const MrCryptoInfo = () => {
  const collectionInfo = api.queriesE7L.getCollectionInfo.useQuery().data;
  const eth_price = 1800;
  return (
    <div className="mt-0">
      {/* <div className="relative -top-3 mx-2 -mt-2 flex items-end align-middle">
        <div className="h-16 w-16 overflow-hidden rounded-xl border-2">
          <Image
            className=""
            src="/mrcrypto2.png"
            width={500}
            height={500}
            alt=""
          />
        </div>
        <h2 className="ml-2 flex h-16 items-center self-center rounded-xl border-2 bg-dark p-4 text-lg font-bold">
          Mr. Crypto by Racksmafia
        </h2>
      </div> */}

      <div className="mx-[4vw] flex flex-col border-b-[1px] py-6">
        <div className="flex items-center justify-center">
          <div className="h-[1px] w-1/2 bg-light"></div>
          <div className="flex flex-col lg:flex-row">
            <div className="stat flex items-end justify-center pb-2 pt-0">
              <div className="stat-title">By</div>
              <div className="stat-value text-xl">Racks Labs</div>
            </div>
          </div>
          <div className="h-[1px] w-1/2 bg-light"></div>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6">
          <div className="stat justify-items-center px-0">
            <div className="stat-title">Created</div>
            <div className="stat-value text-xl">Mar 2022</div>
          </div>

          <div className="stat justify-items-center px-0">
            <div className="stat-title">Chain</div>
            <div className="stat-value text-xl">Polygon</div>
          </div>
          <div className="stat justify-items-center px-0">
            <div className="stat-title">Royalty</div>
            <div className="stat-value text-xl">10%</div>
          </div>

          <div className="stat justify-items-center px-0">
            <div className="stat-title">Items</div>
            <div className="stat-value text-xl">10K</div>
          </div>

          <div className="stat justify-items-center px-0">
            <div className="stat-title">Total volume</div>
            <div className="stat-value text-xl">
              {Math.round(
                ((collectionInfo?.collectionInfo.volumen[1]?.amount || 0) +
                  (collectionInfo?.collectionInfo.volumen[0]?.amount || 0) /
                    eth_price) *
                  100,
              ) / 100}{" "}
              ETH
            </div>
          </div>

          <div className="stat justify-items-center px-0">
            <div className="stat-title">Owners</div>
            <div className="stat-value text-xl">
              {collectionInfo?.collectionInfo.holders}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MrCryptoInfo;
