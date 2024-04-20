import type { PrismaClient } from "@prisma/client";

export const getItemListedById = async ({
  prisma,
  nftId,
}: {
  prisma: PrismaClient;
  nftId: number;
}) => {
  const listedItemsList = await prisma.listing.findMany({
    where: {
      tokenId: nftId,
    },
  });
  if (!listedItemsList) throw new Error("Error on get allListings");
  return listedItemsList;
};

export const getAllItemListed = async ({
  prisma,
}: {
  prisma: PrismaClient;
}) => {
  const listedItemsList = await prisma.listing.findMany({
    include: { collectionERC721: true, erc721: true },
  });

  if (!listedItemsList) throw new Error("Error on get allListings");
  return listedItemsList;
};

export const createListedItem = async ({
  prisma,
  nftAddress,
  paytoken,
  price,
  seller,
  //status,
  timestamp,
  tokenId,
}: {
  prisma: PrismaClient;
  nftAddress: string;
  paytoken: string;
  price: number;
  seller: string;
  //status: string | undefined;
  timestamp: number;
  tokenId: number;
}) => {
  const createdItem = await prisma.listing.findFirst({
    where: {
      tokenId: tokenId,
      status: "LISTED",
    },
  });

  if (createdItem && createdItem.status == "LISTED") {
    const updatedListedItem = await prisma.listing.update({
      where: {
        id: createdItem.id,
      },
      data: {
        price: price,
        paytoken: paytoken,
      },
    });
  return {listedItem: updatedListedItem};
  } else if (!createdItem){
  const createdListedItem = await prisma.listing.create({
    data: {
      nftAddress: nftAddress,
      paytoken: paytoken,
      price: price,
      seller: seller,
      status: "LISTED",
      timestamp: timestamp,
      tokenId: tokenId,
      },
  });
  return {listedItem: createdListedItem};
  }else{
    throw new Error("Error on create listing");
  }
};

export const updateListedItem = async ({
  prisma,
  tokenId,
  price,
  status,
  paytoken,
}: {
  prisma: PrismaClient;
  price: number | undefined;
  tokenId: number;
  status: string | undefined;
  paytoken: string | undefined;
}) => {
  const listing = await prisma.listing.findMany({
    where: {
      tokenId: tokenId,
      status: "LISTED",
    },
  });

  if (!listing) {
    throw new Error("Erro listing not found");
  }

  if (listing.length != 1) {
    throw new Error("Erro listing not found");
  }

  const updatedListing = await prisma.listing.update({
    where: {
      id: listing[0]?.id,
    },
    data: {
      price: price,
      status: status,
      paytoken: paytoken,
    },
  });

  if (!updatedListing) throw new Error("Error on update listing");
  return updatedListing;
};

export const updateStatus = async ({
  prisma,
  tokenId,
  status
}: {
  prisma: PrismaClient;
  tokenId: number;
  status: string;
}) => {
  const listing = await prisma.listing.findMany({
    where: {
      tokenId: tokenId,
      status: "LISTED",
    },
  });

  if (!listing) {
    throw new Error("Error listing not found");
  }

  if (listing.length != 1) {
    throw new Error("Error listing not found");
  }

  const updateListing = await prisma.listing.update({
    where: {
      id: listing[0]?.id,
    },
    data: {
      status: status,
    },
  });

  if (!updateListing) throw new Error("Error on update listing");
  return updateListing;
};
