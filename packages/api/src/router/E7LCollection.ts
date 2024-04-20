import { gql } from "@apollo/client";

import { prisma } from "@acme/db";

import type { E7LCollection } from "../schemaGraphQL";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { client } from "../web-hooks/clientE7L";

export const e7LCollection = createTRPCRouter({
  getE7LCollections: publicProcedure.query(async () => {
    const { data }: { data: E7LCollection } = await client.query({
      query: gql`
        query E7L {
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

    const images: string[] = [];
    
    data.E7L.map(async (item) => {
      const collection = await prisma.e7LCollections.findUnique({
        where: {
          collectionAddress: item.contractAddress,
        },
      });

      if (collection?.collectionImage) {
        images.push(collection.collectionImage);
      }
    });

    return { data, images };
  }),
});
