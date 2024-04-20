import type { PrismaClient } from "@prisma/client";

export const getERC721ById = async ({
  prisma,
  tokenId,
}: {
  prisma: PrismaClient;
  tokenId: number;
}) => {
  const eRC721 = await prisma.eRC721.findMany({
    where: {
      tokenId: tokenId,
    },
  });
  if (!eRC721) throw new Error("Error on get ERC721");
  return eRC721;
};
