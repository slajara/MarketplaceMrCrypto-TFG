type E7L = {
  contractAddress: string;
  name: string;
  supply: number;
};

export type E7LToken = {
  imageURL: string;
  metadata: string;
  E7L: E7L;
  owner: Owner;
};

type Owner = {
  address: string;
};

type volumen = {
  amount: number;
  currency: string;
};

export type E7LFromMRC = {
  mrCryptoById: MrCrypto;
};

export type collectionInfo = {
  collectionInfo: {
    holders: number;
    address: string;
    description: string;
    lastSale: number;
    name: string;
    volumen: volumen[];
  };
};

export type E7LCollection = {
  E7L: E7L[];
};

export type topHolder = {
  topHolders: Holder[];
};
type Holder = {
  address: string;
  numberOfMrCryptos: number;
};

export type mrCryptoById = {
  mrCryptoById: mrCryptoToken;
};

//MR CRYPTO BY ID

export type MrCryptoByIdResponse = {
  mrCrypto: MrCrypto;
  e7LTokens: MrCryptoE7L[];
};

export type mrCryptoToken = {
  imageURL: string;
  metadata: string;
  tokenId: number;
  Owner: {
    address: string;
  };
  E7LTokens: E7LToken[];
};

export type mrCryptoTokens = {
  mrCryptoTokens: mrCryptoToken[];
};

//MRCRYPTO w/ E7Ls LIST RESPONSE

export type MrCryptoTokensListResponse = {
  mrCryptoListResponse: MrCryptoE7LModel[];
};

//APP MODELS

export type MrCryptoE7L = {
  mrCryptoToken: MrCryptoE7LToken;
  supply: number;
  itemName: string;
  contractAddress: string;
};

export type MrCryptoE7LModel = {
  mrCrypto: MrCrypto | undefined;
  e7LTokens: MrCryptoE7L[];
};

//METADATA MODELS

export type MrCrypto = {
  name: string;
  description: string;
  image: string;
  dna: string; // No se que es
  edition: number;
  date: number; // Preguntar que significa esta fecha
  attributes: attributes[];
};

type attributes = {
  trait_type: string;
  value: string;
};

export type MrCryptoE7LToken = {
  image: string;
  description: string;
  video: string;
  animation_url: string;
  name: string;
};

export type mrCryptosByAddress = {
  mrCryptosByAddress: mrCrypto[];
};

export type mrCrypto = {
  imageURL: string;
  metadata: string;
  tokenId: number;
};
