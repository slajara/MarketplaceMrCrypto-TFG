import type {
    E7LToken,
    MrCrypto,
    MrCryptoByIdResponse,
    MrCryptoE7L,
    MrCryptoE7LModel,
    MrCryptoE7LToken,
   // mrCryptoToken,
    mrCryptoTokens,
    MrCryptoTokensListResponse,
  } from "../schemaGraphQL";
  
  export const parseResponseToMrCrypto = async ({
    mrCryptoFromJsonMetadaUrl,
    e7LTokensList,
  }: {
    mrCryptoFromJsonMetadaUrl: string;
    e7LTokensList: E7LToken[];
  }) => {
    const dataMRC: MrCrypto = await fetch(mrCryptoFromJsonMetadaUrl)
      .then((res) => res.json())
      .then((metadata: MrCrypto) => metadata);
  
    const mrCryptoE7LArray: MrCryptoE7L[] = [];
  
    await Promise.all(
      e7LTokensList.map(async (element) => {
        //parse e7l tokens from mrcrypto json metadata url
        const dataE7L: MrCryptoE7LToken = await fetch(element.metadata)
          .then((res) => res.json())
          .then((metadata: MrCryptoE7LToken) => metadata);
        if (dataE7L == undefined || !dataE7L)
          throw new Error(`Error on parse from ${element.metadata}`);
  
        //convert to custom object with custom params
        const mrCryptoE7L: MrCryptoE7L = {
          contractAddress: element.E7L.contractAddress,
          supply: element.E7L.supply,
          itemName: element.E7L.name,
          mrCryptoToken: dataE7L,
        };
  
        mrCryptoE7LArray.push(mrCryptoE7L);
      }),
    );
  
    const mrCryptoResponse: MrCryptoByIdResponse = {
      mrCrypto: dataMRC,
      e7LTokens: mrCryptoE7LArray,
    };
    return mrCryptoResponse;
  };
  
  export const parseToMrCryptoTokensListResponse = ({
    mrCryptoTokens,
  }: {
    mrCryptoTokens: mrCryptoTokens;
  }) => {
    console.log(mrCryptoTokens.mrCryptoTokens);
    const mrCryptoArray: MrCryptoE7LModel[] = [];
  
    //await fetchMrCryptoMetadata(mrCryptoTokens.mrCryptoTokens);
    //console.log("SALIIIIIII");
  
    /*await Promise.all(
      mrCryptoTokens.mrCryptoTokens.map(async (element) => {
        const dataMRC: MrCrypto = await fetch(element.metadata)
          .then((res) => res.json())
          .then((metadata: MrCrypto) => metadata);
  
        const mrCryptoE7LToken: MrCryptoE7L[] = await fetchE7LMetadata(element);
        console.log(mrCryptoE7LToken);
         await Promise.all(
          element.E7LTokens.map(async (e7LAux) => {
            const dataE7L: MrCryptoE7LToken = await fetch(e7LAux.metadata)
              .then((res) => res.json())
              .then((metadata: MrCryptoE7LToken) => metadata);
            if (dataE7L == undefined || !dataE7L)
              throw new Error(`Error on parse from ${element.metadata}`);
            const mrCryptoE7L: MrCryptoE7L = {
              contractAddress: e7LAux.E7L.contractAddress,
              supply: e7LAux.E7L.supply,
              itemName: e7LAux.E7L.name,
              mrCryptoToken: dataE7L,
            };
            mrCryptoE7LArray.push(mrCryptoE7L);
            return mrCryptoE7L;
          }),
        );
        const mrCryptoModel: MrCryptoE7LModel = {
          mrCrypto: dataMRC,
          //e7LTokens: mrCryptoE7LArray,
          e7LTokens: [],
        };
        mrCryptoArray.push(mrCryptoModel);
      }),
    );*/
    const mrCryptoTokensListResponse: MrCryptoTokensListResponse = {
      mrCryptoListResponse: mrCryptoArray,
    };
    mrCryptoTokensListResponse.mrCryptoListResponse.sort(
      (a1, a2) => a1.mrCrypto!.edition - a2.mrCrypto!.edition,
    );
    //console.log("paso de todo", mrCryptoTokensListResponse.mrCryptoListResponse);
    return mrCryptoTokens.mrCryptoTokens;
  };
  
 /* function fetchSingleMrCryptoMetadata(mrCryptoToken: mrCryptoToken) {
    return new Promise(async (resolve, reject) => {
      const callApi = await fetch(mrCryptoToken.metadata).catch(console.error);
      resolve(callApi);
      console.log("callApi", await callApi?.json());
    });
  }*/
  /*
  async function fetchGeneral() {}
  const mrCryptos: MrCrypto[] = [];
  async function fetchMrCryptoMetadata(mrCryptoTokens: mrCryptoToken[]) {
    console.log("SHEGUEEEEEE", mrCryptoTokens);
  
    const allMrCryptoMetadataUrls = mrCryptoTokens.map(
      (element) => element.metadata,
    );
    //console.log("allMrCryptoMetadataUrls", allMrCryptoMetadataUrls);
  
    let result = await Promise.all(
      allMrCryptoMetadataUrls.map((element) => fetch(element)),
    );
  
    let result2 = await Promise.all(result.map((element) => element.json()));
  
    /* for await (const item of mrCryptoTokens) {
      console.log("2");
      try {
        let result2 = await fetchSingleMrCryptoMetadata(item);
        //console.log("result2", result2);
      } catch (message_1) {
        return console.error(message_1);
      }
    }
    return mrCryptoTokens.reduce(async (promise, item) => {
      
    }, Promise.resolve());
  
    const mrCryptoArray: MrCryptoE7LModel[] = [];
    console.log("Llegio");
  
    mrCryptoTokens.map((element) => {});*/
  
    //console.log("Llegio", promisesMrCryptoToken);
    /*for (const task of promisesMrCryptoToken) {
      try { 
        // console.log(await task);
        const mrCryptoModel: MrCryptoE7LModel = {
          mrCrypto: await task,
          //e7LTokens: mrCryptoE7LArray,
          e7LTokens: [],
        };
        console.log("Llegio 2");
        mrCryptoArray.push(mrCryptoModel);
      } catch (e: any) {
        console.log(e);
      }
    }*/
    //console.log("Llegio");
    //console.log("results1", mrCryptoArray);
    /*mrCryptoTokens.map(async (element) => {
      const results2: MrCryptoE7LToken[] = [];
      const results3: MrCryptoE7L[] = [];
      const promisesMrCryptoE7LToken = element.E7LTokens.map(async (e7L) =>
        fetch(e7L.metadata)
          .then((res) => res.json())
          .then((metadata: MrCryptoE7LToken) => metadata),
      );
      for await (const task of promisesMrCryptoE7LToken) {
        const it = await task;
        results2.push(it);
      }
  
      mrCryptoArray.map((mrCryptoE7LModel) => {
        if (mrCryptoE7LModel.mrCrypto?.edition == element.tokenId) {
          mrCryptoE7LModel.e7LTokens = results3;
        }
      });
  
      console.log("results2", element.tokenId);
      console.log("results2", mrCryptoArray);
    });
  
    return [];
  }*/
  
 // export default function useInfiniteScroll(trcpRoute: any) {}