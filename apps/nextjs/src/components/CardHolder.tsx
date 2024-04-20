import React from "react";
import { api } from "~/utils/api";
import { formatAddress } from "../utils/addressFormatter";

interface CardHolderProps {
  position: number;
  addressHolder: string;
  imageURL: string;
  numberOfMRC: number;
}

const CardHolder: React.FC<CardHolderProps> = ({
  position,
  addressHolder,
  imageURL,
  numberOfMRC,
}) => {
  const getUserInfo = api.user.getUser.useQuery({
    userAddress: addressHolder ?? "Holder",
  }).data;

  return (
    <div className=" grid grid-cols-4 rounded-lg  bg-gradient-to-tr from-neutral-600 to-dark p-4 shadow-md hover:scale-105">
      <div className="justify-left col-span-1 flex items-center">
        <div className="h-16 w-16 overflow-hidden rounded-full">
          <img
            className="h-full w-full object-cover"
            src={imageURL}
            alt="Imagen de perfil"
          />
        </div>
      </div>
      <div className="col-span-2 flex flex-col items-center justify-center pl-2">
        <h3 className="text-md pb-2 font-bold">{getUserInfo?.userName || formatAddress(addressHolder)}</h3>
        <p className="mb-2 text-base">NFTs: {numberOfMRC}</p>
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <span className="text-gray-500 text-xl">{position}º</span>
      </div>
    </div>
  );
};

export default CardHolder;
