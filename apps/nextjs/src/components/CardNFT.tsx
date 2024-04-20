import React from 'react';

const CardNFT = () => {
    return (
      <div className="relative flex justify-center items-center">
        <div className="w-64 bg-black rounded-lg overflow-hidden mr-20">
          <img
            src="MrCrypto-8141.png"
            alt="NFT"
            className="w-full h-auto object-cover"
          />
          <div className="bg-black p-4">
            <h2 className="text-center text-xl font-bold text-white mb-2">MR. CRYPTO #0000</h2>
            <p className="text-xs text-center text-white">MR.CRYPTO BY RACKS MAFIA</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default CardNFT;
