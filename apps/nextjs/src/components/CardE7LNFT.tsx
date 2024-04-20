interface CardE7LProps {
  imageURL: string;
  videoURL?: string;
  collectionName: string;
}

const CardE7L: React.FC<CardE7LProps> = ({ imageURL, videoURL, collectionName }) => {
  return (
    <div className="relative flex min-w-fit items-center justify-center">
      <div className=" bg-black mr-10 overflow-hidden rounded-lg border border-light">
        <div className="relative">
          {videoURL ? (
            <video src={videoURL} className="h-40 w-40 object-cover" autoPlay muted loop />
          ) : (
            <img src={imageURL} alt="NFT" className="h-40 w-40 object-cover" />
          )}
          <div className="from-black absolute bottom-0 flex h-1/3 w-full items-center justify-center rounded-lg bg-gradient-to-t to-transparent backdrop-blur-lg backdrop-filter">
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
