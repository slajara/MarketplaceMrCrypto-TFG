import React, { useState } from "react";
import Link from "next/link";

import BackgroundElement from "./BackgroundElement";
import Button from "./Button";

const Hero: React.FC = () => {
  const [img1, setImg1] = useState(0);
  const [img2, setImg2] = useState(0);
  const [img3, setImg3] = useState(0);
  const [img4, setImg4] = useState(0);
  const [img5, setImg5] = useState(0);

  return (
    <>
      <div className="z-0">
        <BackgroundElement shape="circle" position="left" marginTop="100px" />
      </div>

      <div className="mt-10 flex flex-col " id="hero">
        {/* <div className=""> */}
        <div className="flex w-full items-center justify-center">
          <div className=" flex w-3/4 items-center">
            <div className="z-0 -mr-20 ml-10">
              <img
                src="/mrc-3402.avif"
                className="img-hero h-auto w-10/12 transform rounded-lg transition duration-500 hover:scale-110"
                onClick={() => {
                  setImg1(img1 + 1);
                }}
              />
            </div>
            <div className="relative z-10 -mr-10">
              <img
                src="/mrc-5207.avif"
                className="h-auto w-11/12 transform rounded-lg transition duration-500 hover:scale-110"
                onClick={() => {
                  setImg2(img2 + 1);
                }}
              />
            </div>
            <div className="relative z-20">
              <img
                src="/mrc-2433.avif"
                className="h-auto w-full transform  rounded-lg transition duration-500 hover:scale-110"
                onClick={() => {
                  setImg3(img3 + 1);
                }}
              />
            </div>
            <div className="relative z-10 -ml-10">
              <img
                src="/mrc-5586.avif"
                className="h-auto w-11/12 transform rounded-lg transition duration-500 hover:z-50 hover:scale-110"
                onClick={() => {
                  setImg4(img4 + 1);
                }}
              />
            </div>
            <div className="relative z-0 -ml-10">
              <img
                src="/mrc-6788.avif"
                className="h-auto w-10/12 transform rounded-lg transition duration-500 hover:z-50 hover:scale-110"
                onClick={() => {
                  setImg5(img5 + 1);
                }}
              />
            </div>
          </div>
        </div>

        {img1 == 0 && img2 == 1 && img3 == 2 && img4 == 8 && img5 == 0 && (
          <div className="-mb-20 mt-5 flex w-full items-center justify-center">
            <img
              src="/racksmafiaMRC.jpg"
              alt="128"
              className="h-auto w-1/2  rounded-lg border border-light"
            />
          </div>
        )}

        <div className="mt-20 flex w-full items-center justify-center">
          <div className="hero-content flex w-3/4 items-center justify-center text-light">
            <div className="m-2 text-center">
              <h1 className="mb-6 text-5xl font-bold">
                {" "}
                Exploring the Boundless Realm of NFT Art{" "}
              </h1>
              <p className="mb-8 text-lg">
                Dive into the fascinating world of Racksmafia is official NFT
                collection. Discover the enigmatic e7l artworks and explore our
                listings page to find your favorites. Join this digital
                revolution and witness the evolution of art in the blockchain
                era.
              </p>
              <Link href={"/explore"}>
                <Button>EXPLORE NOW</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
