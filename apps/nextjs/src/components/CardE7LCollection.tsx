interface CardE7LProps {
  imageURL: string;
  collectionName: string;
}

const CardE7L: React.FC<CardE7LProps> = ({ imageURL, collectionName }) => {
  return (
    <div className="relative flex min-w-fit items-center justify-center">
      <div className=" bg-black mr-5 overflow-hidden rounded-lg border border-light">
        {/* <div className="relative bg-dark"> */}
        <div className="relative bg-gradient-to-tr from-light via-dark to-light">
          <img src={imageURL} alt="NFT" className="h-40 w-40 object-cover" />
          <div className="absolute bottom-0 flex h-1/3 w-full items-center justify-center rounded-lg backdrop-blur-md backdrop-filter">
            <h6 className="text-center text-xl font-bold text-light">
              {collectionName}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardE7L;