import React from "react";
import { Carousel } from "react-responsive-carousel";

import BackgroundElement from "./BackgroundElement";
import CardListing from "./CardListing";

import "react-responsive-carousel/lib/styles/carousel.min.css";

import { api } from "~/utils/api";

const LiveAuction: React.FC = () => {
  //get live auction items from other endpoint
  let { data: allListings } = api.listings.getAllItemListed.useQuery();

  const renderCarouselItems = () => {
    if (allListings == undefined) {
      allListings = [];
    }
    const items = allListings.map((item, index) => (
      <div key={index}>
        <CardListing
          key={index}
          name={item.erc721!.name}
          price={item.price}
          edition={item.erc721?.edition}
          imgUrl={item.erc721?.imgUrl}
          link={`/collection/${item.erc721?.tokenId}`}
        />
      </div>
    ));

    const carouselItems = [];
    let i = 0;

    while (i < items.length) {
      carouselItems.push(
        <div className="flex justify-center" key={i}>
          {items.slice(i, i + 4).map((item, index) => (
            <div key={index} className="w-1/6 pr-5">
              {item}
            </div>
          ))}
        </div>,
      );
      i += 4;
    }

    return carouselItems;
  };

  return (
    <section className="z-20 mt-20" id="liveAuctions">
      <h2 className="mb-5 text-center text-2xl font-bold">Live Auctions</h2>
      <Carousel
        className=""
        showArrows={true}
        infiniteLoop={true}
        showStatus={false}
        showThumbs={false}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="btn-primary btn-circle text-dark"
              style={{
                position: "absolute",
                zIndex: 50,
                left: 180,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              ❮ {/* Left Arrow */}
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="btn-primary btn-circle text-dark"
              style={{
                position: "absolute",
                zIndex: 50,
                right: 200,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              ❯ {/* Right Arrow */}
            </button>
          )
        }
      >
        {renderCarouselItems()}
      </Carousel>

      <div className="z-0">
        <BackgroundElement shape="circle" position="left" marginTop="-100px" />
      </div>
    </section>
  );
};

export default LiveAuction;
