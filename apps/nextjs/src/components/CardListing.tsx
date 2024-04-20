import Link from "next/link";

interface CardListingProps {
  name: string | undefined;
  imgUrl: string | undefined;
  price: number | undefined;
  edition: number | undefined;
  link: string;
}

const CardListing: React.FC<CardListingProps> = ({
  name,
  price,
  edition,
  imgUrl,
  link,
}) => {
  return (
    <div className="bg-black mb-10 overflow-hidden rounded-lg border border-light">
      <Link href={link}>
        <img src={imgUrl} alt="MrCrypto" className="h-auto w-full object-cover" />
        <div className="bg-black p-4">
          <div className="flex justify-between">
            <div className="text-white text-sm">
              <p className="font-bold">{name}</p>
              <p>{price} USDC</p>
            </div>
            <div className="bg-white rounded-md p-2">
              <p className="text-black text-lg font-bold">#{edition}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardListing;
