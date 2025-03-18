import { useQuery } from "@tanstack/vue-query";
import { api } from "./service-api";
import TokenService from "./service-token";
import HttpClient from "./service.axios";

export interface IPageParams {
  page: number;
  size: number;
}
const getUsers =
  ({ page, size }: IPageParams) =>
  () => {
    return HttpClient.get(api.users.index, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: "Bearer " + TokenService.getToken(),
      },
    });
  };
const GetAllUsers = ({ page, size }: IPageParams) => {
  return useQuery({
    queryKey: [api.users.index],
    queryFn: getUsers({ page, size }),
    select: (data) => data.data,
  });
};

export { GetAllUsers };
