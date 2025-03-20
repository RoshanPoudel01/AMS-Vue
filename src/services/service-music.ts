import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { AxiosError } from "axios";
import { api } from "./service-api";
import TokenService from "./service-token";
import type { IPageParams } from "./service-users";
import HttpClient from "./service.axios";

const getAllMusic =
  ({ page, size }: IPageParams) =>
  () => {
    return HttpClient.get(api.music.index, {
      params: {
        page,
        size,
      },
      headers: {
        Authorization: "Bearer " + TokenService.getToken(),
      },
    });
  };

const GetAllMusic = ({ page, size }: IPageParams) => {
  return useQuery({
    queryKey: [api.music.index],
    queryFn: getAllMusic({ page, size }),
    select: (data) => data.data,
  });
};

const getMusicById = (id: number) => () => {
  return HttpClient.get(api.music.byId.replace(":id", id + ""), {});
};
const GetMusicById = (id: number) => {
  return useQuery({
    queryKey: [api.music.byId, id],
    queryFn: getMusicById(id),
    enabled: !!id,
  });
};

const addMusic = (data: any) => {
  return HttpClient.post(api.music.create, data, {});
};

const AddMusic = () => {
  return useMutation({
    mutationKey: [api.music.create],
    mutationFn: addMusic,
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

const updateMusic = ({ id, data }: { id: number; data: any }) => {
  return HttpClient.put(api.music.update.replace(":id", id + ""), data, {});
};

const UpdateMusic = () => {
  return useMutation({
    mutationKey: [api.music.update],
    mutationFn: updateMusic,
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

const deleteMusic = (id: number) => {
  return HttpClient.delete(api.music.delete.replace(":id", id + ""), {});
};
const DeleteMusic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [api.music.delete],
    mutationFn: deleteMusic,
    onSuccess: (success) => {
      queryClient.invalidateQueries({
        queryKey: [api.music.index],
      });
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

const getMusicByArtistId = (id: number) => () => {
  return HttpClient.get(api.music.index.replace(":id", id + ""), {});
};
const GetMusicByArtist = (id: number) => {
  return useQuery({
    queryKey: [api.music.index, id],
    queryFn: getMusicByArtistId(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};
export {
  AddMusic,
  DeleteMusic,
  GetAllMusic,
  GetMusicByArtist,
  GetMusicById,
  UpdateMusic,
};
