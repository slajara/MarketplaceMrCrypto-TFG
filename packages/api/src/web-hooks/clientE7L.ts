import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  //uri: "https://mrcryptoindexer-production.up.railway.app/api/",
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});
