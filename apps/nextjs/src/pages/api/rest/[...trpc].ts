import { createOpenApiNextHandler } from "trpc-openapi";

import { appRouter, createTRPCContext } from "@acme/api";

// export API handler
//TODO: add onError?
export default createOpenApiNextHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ error, path }) => {
    console.error(`❌ tRPC failed on ${path}: ${error}`);
  },
});

// If you need to enable cors, you can do so like this:
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Enable cors
//   await cors(req, res);

//   // Let the tRPC handler do its magic
//   return createNextApiHandler({
//     router: appRouter,
//     createContext,
//   })(req, res);
// };

// export default handler;
