import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import BackgroundElement from "~/components/BackgroundElement";
import Button from "~/components/Button";
import CardNftProfileItem from "~/components/CardNftProfileItem";
import LisItemDialog from "~/components/ListItemDialog";
import MainLayout from "../../components/layouts/MainLayout";

const UserPage = () => {
  let [isOpen, setIsOpen] = useState(false);
  let [selectedTokenId, setSelectedTokenId] = useState(0);
  const { data: session } = useSession();

  const getUserInfo = api.user.getUser.useQuery({
    userAddress: session?.user.address ?? "DEFAULT",
  }).data;

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleNewDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerImage(e.target.value);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileImage(e.target.value);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);

    updateUser({
      userAddress: session?.user.address ?? "DEFAULT",
      userName: userName,
      description: description,
      profileImage: profileImage,
      bannerImage: bannerImage,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getERC721 = api.queriesE7L.getMRCByAddress.useQuery({
    // address: session?.user.address ?? "DEFAULT",
    address: "0xa64eeA6462463455807cdA93159aDfAa44B63dca",
  }).data;

  const { mutate: updateUser } = api.user.updateUser.useMutation({});

  const loadData = () => {
    setUserName(getUserInfo?.userName || "");
    setDescription(getUserInfo?.description || "");
    setBannerImage(getUserInfo?.bannerImage || "");
    setProfileImage(getUserInfo?.profileImage || "");
  };

  return (
    <MainLayout>
      <section>
        <LisItemDialog
          isOpen={isOpen}
          tokenId={selectedTokenId}
          nftAddress="0xa64eeA6462463455807cdA93159aDfAa44B63dca"
          closeModal={() => setIsOpen(false)}
        ></LisItemDialog>
        <div
          style={{
            backgroundImage: `url(${getUserInfo?.bannerImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="relative h-[300px] w-full overflow-visible bg-primary bg-cover bg-center"
        >
          <div className="z-0">
            <BackgroundElement
              shape="circle"
              position="right"
              marginTop="100px"
            />
          </div>
          <div className="absolute bottom-[-12vh] left-1/2 flex -translate-x-1/2 transform flex-col items-center">
            <div
              style={{
                backgroundImage: `url(${getUserInfo?.profileImage})`,
              }}
              className="h-20 w-20 rounded-full bg-light bg-contain"
            ></div>

            <div className="">
              {isEditing ? (
                <input
                  type="text"
                  value={userName}
                  onChange={handleNewName}
                  className="mx-auto mt-2 block"
                />
              ) : (
                <h3 className="mt-2 text-center text-2xl font-bold">
                  {getUserInfo?.userName}
                </h3>
              )}
              <h4 className="mb-2 mt-2 text-center">{session?.user.address}</h4>
              {/** 
                <h4 className="mb-2 mt-2 text-center"> {formatAddress(JSON.stringify(session?.user.address, null, 2))} </h4>
              */}
              {isEditing ? (
                <input
                  type="text"
                  value={description}
                  onChange={handleNewDescription}
                  className="mx-auto mt-2 block"
                />
              ) : (
                <h4 className="mb-2 mt-2 text-center">
                  {getUserInfo?.description}
                </h4>
              )}

              {!isEditing && (
                <Button
                  onClick={() => {
                    loadData();
                    handleEditProfile();
                  }}
                  className="mt-5"
                >
                  Edit Profile
                </Button>
              )}

              {isEditing && (
                <div>
                  <div>
                    <button onClick={() => setBannerImage(bannerImage)}>
                      Image Banner:
                    </button>

                    <input
                      type="text"
                      value={bannerImage}
                      onChange={handleBannerChange}
                      className="mx-auto ml-2 mt-2"
                    />
                  </div>

                  <button onClick={() => setProfileImage(profileImage)}>
                    Image Profile:
                  </button>
                  <input
                    type="text"
                    value={profileImage}
                    onChange={handleProfileChange}
                    className="mx-auto ml-2 mt-2"
                  />

                  <div className="block">
                    <Button
                      onClick={handleSaveProfile}
                      className="btn-primary btn ml-20 mt-5 text-dark"
                    >
                      Save Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="divider mt-[14vh]"></div>
      <div className="z-0">
        <BackgroundElement shape="circle" position="left" marginTop="100px" />
      </div>
      <section className=" mx-10 mt-10 flex flex-wrap items-center gap-5">
        {getERC721?.mrCryptosByAddress.map((nft, index) => (
          <CardNftProfileItem
            index={index}
            nft={nft}
            price={0}
            link={`/collection/${nft.tokenId}`}
            edition={0}
          />
        ))}
      </section>
    </MainLayout>
  );
};

export default UserPage;
