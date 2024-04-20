import Link from "next/link";

import { mrCrypto } from "@acme/api/src/schemaGraphQL";

interface CardNftProfileItemProps {
  index: number;
  nft: mrCrypto;
  price: number | undefined;
  edition: number | undefined;
  link: string;
}

const CardNftProfileItem: React.FC<CardNftProfileItemProps> = ({
  nft,
  index,
  link,
}) => {
  return (
    <Link href={link}>
      <div
        key={index}
        className="border-white card w-[250px] border bg-base-100 shadow-xl"
      >
        <figure>
          <img
            src={nft.imageURL}
            alt={`imagen del nft ${nft.tokenId}`}
            className="transition duration-500 hover:scale-110"
          />
        </figure>
        <div className="card-body flex items-center">
          <h3 className="text-center text-2xl font-bold">
            Mr.Crypto #{nft.tokenId}
            <img
              src="/verified.png"
              alt="verified"
              className="ml-2 inline-block h-6 w-6 "
            />
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CardNftProfileItem;
