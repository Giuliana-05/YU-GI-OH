import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../api/axiosCliente";

// Busca cartas via REST
export function useCardsREST() {
  return useQuery({
    queryKey: ["cards-rest"],
    queryFn: async () => {
      const response = await axiosClient.get("/cardinfo.php", {
        params: { num: 10, offset: 0 },
      });
      return response.data.data;
    },
  });
}
