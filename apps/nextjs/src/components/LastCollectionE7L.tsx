import { api } from "~/utils/api";
import CardE7L from "./CardE7LNFT";

const LasCollectionE7L: React.FC = () => {
  const e7LCollection = api.e7LCollection.getE7LCollections.useQuery().data;

  console.log(e7LCollection, "e7LCollection");

  return (
    <>
      <div className="mx-auto mt-20 w-3/4">
        <h2 className="mb-5 text-center text-2xl font-bold">E7L Collections</h2>
        <div
          className="rewind carousel-end carousel rounded-box bg-opacity-50 bg-gradient-to-tr from-dark via-primary to-dark p-4 "
          id="collectionE7L"
        >
          {e7LCollection &&
            e7LCollection.data.E7L.map((e7L, index) => (
              <div key={index} className="carousel-item relative">
                <CardE7L
                  key={index + 1}
                  collectionName={e7L.name || ""}
                  imageURL={e7LCollection.images[index] || "mrc-unrevealed.jpg"}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default LasCollectionE7L;
