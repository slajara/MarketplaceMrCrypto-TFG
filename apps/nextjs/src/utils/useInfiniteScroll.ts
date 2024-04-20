import { useCallback, useRef } from "react";

import { type api } from "./api";

export default function useInfiniteScroll(
  trcpRoute: ReturnType<
    typeof api.queriesE7L.getMrCryptoTokens.useInfiniteQuery
  >,
): ((node: Element | null) => void)[] {
  const observer = useRef<IntersectionObserver>();

  const lastPageElementRef = useCallback(
    (node: Element | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(function (entries) {
        if (entries[0]?.isIntersecting && trcpRoute.hasNextPage) {
          trcpRoute
            .fetchNextPage()
            .then()
            .catch((error) => console.log(error));
        }
      });

      if (node) observer.current.observe(node);
    },
    [trcpRoute.isLoading, trcpRoute.hasNextPage],
  );

  return [lastPageElementRef];
}
