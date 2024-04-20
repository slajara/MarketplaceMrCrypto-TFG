import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  createListedItem,
  getAllItemListed,
  getItemListedById,
  updateListedItem,
  updateStatus,
} from "../web-hooks/listings-web-hooks";

export const listingsRouter = createTRPCRouter({
  getAllItemListed: publicProcedure.query(async ({ ctx }) => {
    const allListings = await getAllItemListed({
      prisma: ctx.prisma,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (!allListings) {
      throw new Error("error on get all listings");
    }
    return allListings;
  }),
  getItemListedById: publicProcedure
    .input(z.object({ nftId: z.number() }))
    .query(async ({ ctx, input }) => {
      //TODO: pasar nftId a traves de ctx???

      const listingById = await getItemListedById({
        prisma: ctx.prisma,
        nftId: input.nftId,
      });
      if (!listingById) {
        throw new Error("error on get listing by id");
      }
      return listingById;
    }),
  createListedItem: publicProcedure
    .meta({
      openapi: { method: "POST", path: "/listing", tags: ["listing"] },
    })
    .input(
      z.object({
        nftAddress: z.string().optional(),
        paytoken: z.string(),
        price: z.number(),
        seller: z.string(),
        //status: z.string().optional(),
        timestamp: z.number(),
        tokenId: z.number(),
      }),
    )
    .output(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const createdListedItem = await createListedItem({
        prisma: ctx.prisma,
        nftAddress:
          input.nftAddress ?? "0x0dB6F4726432a4B5fF296CF34216Ad06D0fdC16d",
        paytoken: input.paytoken,
        price: input.price,
        seller: input.seller,
        //status: input.status,
        timestamp: input.timestamp,
        tokenId: input.tokenId,
      });

      return createdListedItem;
    }),
  updateListedItem: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/listing/update/{tokenId}",
        tags: ["listing"],
      },
    })
    .input(
      z.object({
        price: z.number().optional(),
        tokenId: z.number(),
        status: z.string().optional(),
        paytoken: z.string().optional(),
      }),
    )
    .output(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const updatedListing = await updateListedItem({
        prisma: ctx.prisma,
        tokenId: input.tokenId,
        price: input.price,
        status: input.status,
        paytoken: input.paytoken,
      });

      return updatedListing;
    }),
  cancelListedItem: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/listing/cancel/{tokenId}",
        tags: ["listing"],
      },
    })
    .input(
      z.object({
        tokenId: z.number(),
      }),
    )
    .output(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const cancelListing = await updateStatus({
        prisma: ctx.prisma,
        tokenId: input.tokenId,
        status: "CANCEL",
      });

      return cancelListing;
    }),
  buyListedItem: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/listing/buy/{tokenId}",
        tags: ["listing"],
      },
    })
    .input(
      z.object({
        tokenId: z.number(),
      }),
    )
    .output(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const updatedListing = await updateStatus({
        prisma: ctx.prisma,
        tokenId: input.tokenId,
        status: "BOUGHT",
      });

      return updatedListing;
    }),
});
