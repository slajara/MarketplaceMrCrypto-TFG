import React from "react";

import Button from "./Button";

const Hero = () => {
  return (
    <section className="mt-20 flex items-center justify-center" id="findUs">
      <div className="container mx-auto flex items-center justify-between">
        <div className="ml-20 w-1/2 text-center text-light">
          <h1 className="mb-4 text-4xl font-bold ">
            Discover Best Collection NFT
          </h1>
          <p className="mb-8 text-lg">
            This is the description of the best collection NFT. It showcases a
            wide range of unique and valuable digital assets created by talented
            artists from around the world.
          </p>
          <div className="flex">
            <Button>DISCORD</Button>
            <Button>WEB</Button>
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <div className="flex items-center">
            <img
              src="/mrc-R-3143.png"
              alt="Pago de DaniDS por su ayuda"
              className="mr-20 h-auto w-96 rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
