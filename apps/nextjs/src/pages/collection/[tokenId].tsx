import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// import { useContractWrite, useWaitForTransaction } from "wagmi";

import { api } from "~/utils/api";
import BackgroundElement from "~/components/BackgroundElement";
import CardE7LNFT from "~/components/CardE7LNFT";
import MainLayout from "~/components/layouts/MainLayout";
import ABI_ERC20 from "../../constants/constantERC20.json";
import BuyItem from "../../hooks/buyItem";
import CancelListing from "../../hooks/cancelItem";
import ListItem from "../../hooks/listItem";
import ModifyListing from "../../hooks/modifyItem";

function NftAddress() {
  const router = useRouter();
  const { tokenId } = router.query;
  const parsedTokenId = Number(tokenId);

  const getERC721ById = api.queriesE7L.getMrCryptoById.useQuery({
    tokenId: parsedTokenId,
  }).data;

  console.log(getERC721ById, "getERC721");

  const getItemListedById = api.listings.getItemListedById.useQuery({
    nftId: parsedTokenId,
  }).data;

  console.log(getItemListedById, "getItemListedById");

  const { data: session } = useSession();

  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (index: number) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const isItemActive = (index: number) => {
    return index === activeIndex;
  };

  const getSymbol = (index: number) => {
    return isItemActive(index) ? "-" : "+";
  };

  /////////////////////// LISTING ///////////////////////

  // const approveListing = useContractWrite({
  //   address: `0x${ABI_ERC721.address.slice(2)}`, // address marketplace e7l
  //   abi: JSON.parse(ABI_ERC721.abi) as any[],
  //   chainId: 80001,
  //   functionName: "approve",
  //   args: [`0x${ABI_MK.address.slice(2)}`, 5],
  // });

  // const itemListing = useContractWrite({
  //   address: `0x${ABI_MK.address.slice(2)}`, //
  //   abi: JSON.parse(ABI_MK.abi) as any[],
  //   chainId: 80001,
  //   functionName: "listItem",
  //   args: [`0x${ABI_ERC20.address.slice(2)}`, 5, 10],
  // }).write;

  // useWaitForTransaction({
  //   hash: approveListing.data?.hash,
  //   onSuccess: () => {
  //     itemListing();
  //   },
  // });

  // const listingNft = () => {
  //   approveListing.write();
  // };

  /////////////////////// CANCEL LISTING ///////////////////////

  // const cancelListingContract = useContractWrite({
  //   address: `0x${ABI_MK.address.slice(2)}`,
  //   abi: JSON.parse(ABI_MK.abi) as any[],
  //   chainId: 80001,
  //   functionName: "cancelListing",
  //   args: [5],
  // }).write;
  // const cancelListing = () => {
  //   cancelListingContract();
  //   console.log("Cancel Liting NFT");
  // };

  /////////////////////// MODIFY LISTING ///////////////////////

  // const modifyItemContract = useContractWrite({
  //   address: `0x${ABI_MK.address.slice(2)}`,
  //   abi: JSON.parse(ABI_MK.abi) as any[],
  //   chainId: 80001,
  //   functionName: "modifyItem",
  //   args: [`0x${ABI_ERC20.address.slice(2)}`, 1, 20],
  // }).write;
  // const modifyItem = () => {
  //   modifyItemContract();
  //   console.log("Modify Listing NFT");
  // };

  /////////////////////// BUY ITEM ///////////////////////

  // const buyItemContract = useContractWrite({
  //   address: `0x${ABI_MK.address.slice(2)}`,
  //   abi: JSON.parse(ABI_MK.abi) as any[],
  //   chainId: 80001,
  //   functionName: "buyItem",
  //   args: [1],
  // }).write;
  // const buyItem = () => {
  //   buyItemContract();
  //   console.log("Buy NFT Listed");
  // };

  return (
    <MainLayout>
      <div className="-z-20 min-h-screen bg-dark bg-opacity-0">
        <BackgroundElement
          shape="triangle"
          position="left"
          marginTop="-500px"
        />
        <BackgroundElement shape="circle" position="right" marginTop="-350px" />
        <div className="w-full px-5 lg:hidden">
          <h2 className="p-5 text-4xl">
            {getERC721ById?.mrCryptoResponse.mrCrypto.name}
          </h2>
          <h3 className="px-5 text-sm">
            Owned by {getERC721ById?.data.mrCryptoById.Owner.address}
          </h3>
        </div>
        <div className="lg:flex">
          <div className="p-5 lg:flex lg:w-full lg:flex-col lg:items-center">
            <div className="">
              <img
                className="h-full w-[500px] rounded-xl"
                src={getERC721ById?.mrCryptoResponse.mrCrypto.image}
                alt=""
              />
            </div>
            <div className="w-full lg:w-[95%] lg:p-8">
              <div className="collapse">
                <input
                  type="radio"
                  name="accordion"
                  checked={activeIndex === 0}
                  onChange={() => handleClick(0)}
                />
                <h3 className="collapse-title flex justify-between px-2 text-xl">
                  E7L
                  <span className="items-end">{getSymbol(0)}</span>
                </h3>
                <div
                  className={`collapse-content flex overflow-hidden ${
                    isItemActive(0) ? "block" : "hidden"
                  }`}
                >
                  {getERC721ById?.mrCryptoResponse.e7LTokens.length &&
                  getERC721ById?.mrCryptoResponse.e7LTokens.length > 0 ? (
                    getERC721ById?.mrCryptoResponse.e7LTokens.map(
                      (token, index) => (
                        <CardE7LNFT
                          key={index}
                          imageURL={
                            token.mrCryptoToken.image &&
                            token.mrCryptoToken.image
                          }
                          videoURL={
                            token.mrCryptoToken.video &&
                            token.mrCryptoToken.video
                          }
                          collectionName={token.itemName}
                        />
                      ),
                    )
                  ) : (
                    <p>No E7Ls linked</p>
                  )}
                </div>
              </div>
              <div className="collapse">
                <input
                  type="radio"
                  name="accordion"
                  checked={activeIndex === 1}
                  onChange={() => handleClick(1)}
                />
                <h3 className="collapse-title flex justify-between px-2 text-xl">
                  Description
                  <span className="items-end">{getSymbol(1)}</span>
                </h3>
                <div
                  className={`collapse-content ${
                    isItemActive(1) ? "block" : "hidden"
                  }`}
                >
                  <p className="font-bold">
                    {getERC721ById?.mrCryptoResponse.mrCrypto.name}
                  </p>
                  <p className="font-bold">
                    {getItemListedById &&
                      getItemListedById[getItemListedById.length - 1]?.seller}
                  </p>
                </div>
              </div>

              <div className="collapse">
                <input
                  type="radio"
                  name="accordion"
                  checked={activeIndex === 2}
                  onChange={() => handleClick(2)}
                />
                <h3 className="collapse-title flex justify-between px-2 text-xl">
                  About MrCrypto
                  <span className="items-end">{getSymbol(2)}</span>
                </h3>
                <div
                  className={`collapse-content flex items-center ${isItemActive(
                    2,
                  )}`}
                >
                  <Image
                    className="h-24 w-24 rounded-xl"
                    src="/mrcrypto2.png"
                    alt=""
                    width={500}
                    height={500}
                  />
                  <p className="font-bold">
                    Colección NFT oficial de Racksmafia
                  </p>
                </div>
              </div>

              <div className="collapse">
                <input
                  type="radio"
                  name="accordion"
                  checked={activeIndex === 3}
                  onChange={() => handleClick(3)}
                />
                <h3 className="collapse-title flex justify-between px-2 text-xl">
                  Details
                  <span className=" items-end">{getSymbol(3)}</span>
                </h3>
                <div className={`collapse-content ${isItemActive(3)}`}>
                  <p className="font-bold">
                    Contract Address{" "}
                    <span className="font-normal">0xef45...6969</span>
                  </p>
                  <p className="font-bold">
                    Token Standard <span className="font-normal">ERC-721</span>
                  </p>
                  <p className="font-bold">
                    Chain <span className="font-normal">Polygon</span>
                  </p>
                  <p className="font-bold">
                    Royalty <span className="font-normal">10%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-5 lg:p-12">
            <div className="hidden lg:block">
              <h2 className="p-5 text-4xl">
                {getERC721ById?.mrCryptoResponse.mrCrypto.name}
              </h2>
              <h3 className="px-5 text-lg">
                Owned by {getERC721ById?.data.mrCryptoById.Owner.address}
              </h3>
            </div>
            <div className="my-10 rounded-xl border-[1px] p-5">
              <h3 className="border-b-[1px] py-2 text-3xl">Listings</h3>
              {getItemListedById && getItemListedById?.length > 0 ? (
                <div className="grid w-full grid-cols-1 grid-rows-2 justify-center justify-items-center gap-4 pb-5 pt-5">
                  <div className="font-bold">Price</div>
                  {/* <div className="font-bold">USD Price</div>
                <div className="font-bold">Floor Difference</div> */}
                  {/* <div className="font-bold">Expiration</div> */}
                  {/* <div className="font-bold">From</div> */}
                  <div>
                    {getItemListedById[getItemListedById.length - 1]?.price}
                  </div>
                  {/* <div>$64.82</div> */}
                  {/* <div>31% below</div> */}
                  {/* <div>in 22 hours</div> */}
                  {/* <div>7E8B7B</div> */}
                  {session?.user.address ==
                    getItemListedById[getItemListedById.length - 1]?.seller &&
                    getItemListedById[getItemListedById.length - 1]?.status ==
                      "LISTED" && (
                      <div>
                        <CancelListing tokenId={parsedTokenId} />
                        <ModifyListing
                          tokenId={parsedTokenId}
                          paytoken={`0x${ABI_ERC20.address.slice(2)}`}
                          listingPrice={10}
                        />
                      </div>
                    )}
                  {session?.user.address !=
                    getItemListedById[getItemListedById.length - 1]?.seller &&
                    getItemListedById[getItemListedById.length - 1]?.status ==
                      "LISTED" && <BuyItem tokenId={parsedTokenId} />}
                  {session?.user.address ==
                    getItemListedById[getItemListedById.length - 1]?.seller &&
                    getItemListedById[getItemListedById.length - 1]?.status ==
                      "CANCEL" && (
                      <div className="p-5">
                        <ListItem
                          tokenId={parsedTokenId}
                          paytoken={`0x${ABI_ERC20.address.slice(2)}`}
                          listingPrice={10}
                        />
                      </div>
                    )}
                </div>
              ) : (
                <div className="p-5">
                  <ListItem
                    tokenId={parsedTokenId}
                    paytoken={`0x${ABI_ERC20.address.slice(2)}`}
                    listingPrice={10}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default NftAddress;
