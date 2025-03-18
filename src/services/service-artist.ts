import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { api } from "./service-api";
import TokenService from "./service-token";
import HttpClient from "./service.axios";

export const getArtists = (params: { page: number; size: number }) => {
  return HttpClient.get(api.artists.index, {
    params: {
      page: params.page,
      size: params.size,
    },
    headers: {
      Authorization: "Bearer " + TokenService.getToken(),
    },
  });
};

const GetAllArtists = (params: { page: number; size: number }) => {
  return useQuery({
    queryKey: computed(() => [api.artists.index, params.page, params.size]),
    queryFn: () => getArtists(params),
    select: (data) => data.data,
  });
};

export { GetAllArtists };
