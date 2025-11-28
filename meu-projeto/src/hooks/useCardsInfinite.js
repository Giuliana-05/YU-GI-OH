import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosClient } from "../api/axiosCliente";

export function useCardsInfinite(type = "all") {
  return useInfiniteQuery({
    queryKey: ["cards", type],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosClient.get(
        `/cardinfo.php?offset=${pageParam}&num=10`
      );
      return res.data.data; // array de cartas
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      return pages.length * 10; // próximo offset
    },
  });
}
