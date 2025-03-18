import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { api } from "./service-api";
import TokenService from "./service-token";
import type { IPageParams } from "./service-users";
import HttpClient from "./service.axios";

export const getArtists =
  ({ page, size }: IPageParams) =>
  () => {
    return HttpClient.get(api.artists.index, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: "Bearer " + TokenService.getToken(),
      },
    });
  };
const GetAllArtists = ({ page, size }: IPageParams) => {
  console.log({ page, size });
  return useQuery({
    queryKey: computed(() => [api.artists.index, page, size]),
    queryFn: getArtists({ page, size }),
    select: (data) => data.data,
  });
};

export { GetAllArtists };
