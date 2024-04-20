import { authRouter } from "./router/auth";
import { e7LCollection } from "./router/E7LCollection";
import { eRC721Router } from "./router/ERC721";
import { listingsRouter } from "./router/listings";
import { e7LRouter } from "./router/queriesE7L";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  listings: listingsRouter,
  queriesE7L: e7LRouter,
  e7LCollection: e7LCollection,
  eRC721: eRC721Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
