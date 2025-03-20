import { toast } from "@/components/ui/toast";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { AxiosError } from "axios";
import { api } from "./service-api";
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
    });
  };
const GetAllUsers = ({ page, size }: IPageParams) => {
  return useQuery({
    queryKey: [api.users.index],
    queryFn: getUsers({ page, size }),
    select: (data) => data.data,
  });
};

const addUser = (data: any) => {
  return HttpClient.post(api.users.index, data, {});
};

const AddUser = () => {
  return useMutation({
    mutationKey: [api.users.index],
    mutationFn: addUser,
    onSuccess: (success) => {
      toast({
        title: "Success",
        description: success.data.message,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });
};

const getUserById = (id: number) => {
  return HttpClient.get(api.users.byId.replace(":id", id + ""), {});
};

const GetUserById = (id: number) => {
  return useQuery({
    queryKey: [api.users.index, id],
    queryFn: () => getUserById(id),
    select: (data) => data.data,
  });
};

const updateUser = ({ id, data }: { id: number; data: any }) => {
  return HttpClient.put(api.users.byId.replace(":id", id + ""), data, {});
};

const UpdateUser = () => {
  return useMutation({
    mutationKey: [api.users.byId],
    mutationFn: updateUser,
    onSuccess: (success) => {
      toast({
        title: "Success",
        description: success.data.message,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });
};

const deletUser = (id: number) => {
  return HttpClient.delete(api.users.byId.replace(":id", id + ""), {});
};
const UseDeleteUser = () => {
  return useMutation({
    mutationKey: [api.users.byId],
    mutationFn: deletUser,
    onSuccess: (success) => {
      toast({
        title: "Success",
        description: success.data.message,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error?.response?.data?.message,
      });
    },
  });
};
export { AddUser, GetAllUsers, GetUserById, UpdateUser, UseDeleteUser };
