import Image from "next/image";

import { api } from "~/utils/api";
import useInfiniteScroll from "~/utils/useInfiniteScroll";
import BackgroundElement from "~/components/BackgroundElement";
import CardListing from "~/components/CardListing";
import MainLayout from "~/components/layouts/MainLayout";
import MrCryptoInfo from "~/components/MrCryptoInfo";

function Explore() {
  const mrCryptos = api.queriesE7L.getMrCryptoTokens.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const [lastPageElementRef] = useInfiniteScroll(mrCryptos);

  return (
    <MainLayout>
      <div className="bg-dark bg-opacity-0">
        <BackgroundElement shape="circle" position="left" marginTop="-200px" />
        <BackgroundElement shape="square" position="right" />
        <BackgroundElement shape="square" position="left" marginTop="700px" />
        <div className="relative z-20">
          <div className="relative w-full">
            <Image
              className="max-h-64 w-full object-cover"
              src="/mrcrypto1.png"
              width={3000}
              height={3000}
              alt=""
            />
            <div className="relative -top-3 mx-2 -mt-2 flex items-end align-middle">
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
            </div>
            <MrCryptoInfo />
            {mrCryptos?.isLoading || mrCryptos == undefined ? (
              <div className="m-20 flex justify-center">
                <span className="w-100 loading loading-ring loading-lg"></span>
              </div>
            ) : (
              <div className="mx-[5vw] mt-8 grid grid-cols-2 justify-center gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {mrCryptos.data?.pages.map((page, indexPage) =>
                  page.data.mrCryptoTokens.map((mrCrypto, indexMrCrypto) => {
                    if (
                      indexMrCrypto + 1 == page.data.mrCryptoTokens.length &&
                      indexPage + 1 == mrCryptos.data?.pages.length
                    ) {
                      return (
                        <div ref={lastPageElementRef} key={indexMrCrypto}>
                          <CardListing
                            key={indexMrCrypto}
                            name={`Mr Crypto #${mrCrypto.tokenId}`}
                            price={0}
                            edition={mrCrypto.tokenId}
                            imgUrl={mrCrypto.imageURL}
                            link={`/collection/${mrCrypto.tokenId}`}
                          />
                        </div>
                      );
                    }
                    return (
                      <CardListing
                        key={indexMrCrypto}
                        name={`Mr Crypto #${mrCrypto.tokenId}`}
                        price={0}
                        edition={mrCrypto.tokenId}
                        imgUrl={mrCrypto.imageURL}
                        link={`/collection/${mrCrypto.tokenId}`}
                      />
                    );
                  }),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Explore;
