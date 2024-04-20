import { gql } from "@apollo/client";
import { z } from "zod";

import type {
  collectionInfo,
  E7LCollection,
  E7LFromMRC,
  mrCryptoById,
  MrCryptoByIdResponse,
  mrCryptosByAddress,
  mrCryptoTokens,
  topHolder,
} from "../schemaGraphQL";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { client } from "../web-hooks/clientE7L";
import { parseResponseToMrCrypto } from "../web-hooks/utils-web-hooks";

export const e7LRouter = createTRPCRouter({
  getMrCryptoById: publicProcedure
    .input(z.object({ tokenId: z.number() }))
    .query(async ({ input }) => {
      const { data }: { data: mrCryptoById } = await client.query({
        query: gql`
        query MrCryptoById {
          mrCryptoById(tokenId: ${input.tokenId}) {
            tokenId
            metadata
            imageURL
            Owner {
              address
            }
            E7LTokens {
              imageURL
              metadata
              E7L {
                contractAddress
                name
                supply
              }
              Owner {
                address
              }
            }
          }
        }
      `,
      });

      const mrCryptoResponse: MrCryptoByIdResponse =
        await parseResponseToMrCrypto({
          mrCryptoFromJsonMetadaUrl: data.mrCryptoById.metadata,
          e7LTokensList: data.mrCryptoById.E7LTokens,
        });
      console.log("mrCryptoResponse", mrCryptoResponse);

      return {
        mrCryptoResponse,
        data,
      };
    }),
  getE7LCollections: publicProcedure.query(async ({}) => {
    const { data }: { data: E7LCollection } = await client.query({
      query: gql`
        query MrCryptoById {
          e7lCollections {
            contractAddress
            linked
            name
            supply
            synchronized
          }
        }
      `,
    });
    return data;
  }),
  getMrCryptoTokens: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const LIMIT = 50;
      const { cursor } = input;
      const { data }: { data: mrCryptoTokens } = await client.query({
        query: gql`
          query getMrCryptoTokens {
            mrCryptoTokens(skip: ${input.cursor ?? 0}, first: ${LIMIT}) {
              tokenId
              metadata
              imageURL
              E7LTokens {
                imageURL
                metadata
                E7L {
                  contractAddress
                  name
                  supply
                }
                Owner {
                  address
                }
              }
            }
          }
        `,
      });

      const result = {
        data: data,
        nextCursor: cursor ? cursor + LIMIT : LIMIT,
      };
      return result;
    }),
  getE7LFromMRC: publicProcedure
    .input(z.object({ tokenId: z.number() }))
    .query(async ({ input }) => {
      const { data }: { data: E7LFromMRC } = await client.query({
        query: gql`
          query MrCryptoById {
            mrCryptoById(tokenId: ${input.tokenId}) {
              E7LTokens {
                imageURL
                linked
                metadata
                synced
                tokenId
                E7L {
                  contractAddress
                  name
                }
              }
            }
          }
        `,
      });
      return data;
    }),
  getCollectionInfo: publicProcedure.query(async ({}) => {
    const { data }: { data: collectionInfo } = await client.query({
      query: gql`
        query MrCryptoById {
          collectionInfo {
            holders
            address
            description
            lastSale
            name
            volumen {
              amount
              currency
            }
          }
        }
      `,
    });
    return data;
  }),
  getTopHolders: publicProcedure
    .input(z.object({ range: z.number() }))
    .query(async ({ input }) => {
      const { data }: { data: topHolder } = await client.query({
        query: gql`
        query TopHolders {
          topHolders(take: ${input.range}) {
            address
            numberOfMrCryptos
          }
        }
      `,
      });
      return data;
    }),
  getMRCByAddress: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      const { data }: { data: mrCryptosByAddress } = await client.query({
        query: gql`
          query MrCryptosByAddress {
            mrCryptosByAddress(address: "${input.address}") {
                imageURL
                metadata
                tokenId
            }
        }
        `,
      });
      return data;
    }),
});
