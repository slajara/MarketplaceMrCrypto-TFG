import { createTRPCRouter, publicProcedure } from "../trpc";
import { getERC721ById } from "../web-hooks/eRC721-web-hooks";
import { z } from "zod";

export const eRC721Router = createTRPCRouter({
  getERC721ById: publicProcedure
    .input(z.object({ tokenId: z.number() }))
    .query(async ({ ctx, input }) => {
      const eRC721ById = await getERC721ById({
        prisma: ctx.prisma,
        tokenId: input.tokenId,
      });
      if (!eRC721ById) {
        throw new Error("error on get listing by id");
      }
      return eRC721ById;
    }),
});
