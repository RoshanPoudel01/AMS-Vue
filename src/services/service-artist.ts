import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { AxiosError } from "axios";
import { computed } from "vue";
import { api } from "./service-api";
import HttpClient from "./service.axios";

const getArtists = (params: { page: number; size: number }) => {
  return HttpClient.get(api.artists.index, {
    params: {
      page: params.page,
      size: params.size,
    },
  });
};

const GetAllArtists = (params: {
  page: number;
  size: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: computed(() => [api.artists.index, params.page, params.size]),
    queryFn: () => getArtists(params),
    select: (data) => data.data,
    enabled: params.enabled,
  });
};

const exportArtists = () => {
  return HttpClient.get(api.artists.export, {});
};
const ExportArtists = (enabled: boolean) => {
  return useQuery({
    queryKey: [api.artists.export],
    queryFn: exportArtists,
    enabled: enabled,
  });
};

const addArtist = (data: any) => {
  return HttpClient.post(api.artists.create, data, {});
};
const AddArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [api.artists.create],
    mutationFn: addArtist,
    onSuccess: (succcess) => {
      toast({
        title: "Success",
        description: succcess.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: [api.artists.index],
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

const deleteArtist = (id: number) => {
  return HttpClient.delete(api.artists.delete?.replace(":id", id + ""), {});
};
const DeleteArtist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [api.artists.delete],
    mutationFn: deleteArtist,
    onSuccess: (succcess) => {
      toast({
        title: "Success",
        description: succcess.data.message,
      });
      queryClient.invalidateQueries({
        queryKey: [api.artists.index],
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

const getArtistById = (id: number) => {
  return HttpClient.get(api.artists.byId?.replace(":id", id + ""), {});
};
const GetArtistById = (id: number) => {
  return useQuery({
    queryKey: [api.artists.byId, id],
    queryFn: () => getArtistById(id),
    select: (data) => data.data,
  });
};

const updateArtist = ({ data, id }: { data: any; id: number }) => {
  return HttpClient.put(api.artists.update?.replace(":id", id + ""), data, {});
};
const UpdateArtist = () => {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [api.artists.update],
    mutationFn: updateArtist,
    onSuccess: (succcess) => {
      toast({
        title: "Success",
        description: succcess.data.message,
      });
      // queryClient.invalidateQueries({
      //   queryKey: [api.artists.index],
      // });
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
export {
  AddArtist,
  DeleteArtist,
  ExportArtists,
  GetAllArtists,
  GetArtistById,
  UpdateArtist,
};
