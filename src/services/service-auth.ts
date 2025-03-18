import { useToast } from "@/components/ui/toast";
import router from "@/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import { api } from "./service-api";
import TokenService from "./service-token";
import HttpClient from "./service.axios";

export const authTokenKey = "authTokenKey";
export const authTokenDetails = "authTokenDetails";

export interface ILogin {
  email: string;
  password: string;
}
const { toast } = useToast();
const initLogin = (data: ILogin) => {
  return HttpClient.post(api.auth.login, data);
};

const useLogin = () => {
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirect") ?? "/";
  return useMutation({
    mutationKey: [api.auth.login],
    mutationFn: initLogin,
    onSuccess: (response) => {
      TokenService.setToken(response?.data?.access_token);
      router.push({ path: redirectUrl });
      toast({
        title: "Login Success",
        description: "You have successfully logged in",
      });
    },
    onError: (error) => {
      const err = error as AxiosError<{ error: string; message: string }>;
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err?.response?.data?.error,
      });
    },
  });
};

const initLogout = () => {
  try {
    TokenService.clearToken();
    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
};

const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: initLogout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData([authTokenKey], () => false);
      window.location.reload();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Something went wrong while logging out",
      });
    },
  });
};

const checkAuthentication = async () => {
  if (TokenService.isAuthenticated()) {
    const tokenInfo = TokenService.getToken();
    if (tokenInfo && tokenInfo.expiresIn > Date.now()) {
      return Promise.resolve(true);
    } else {
      TokenService.clearToken();
      return Promise.resolve(false);
    }
  } else {
    return Promise.resolve(false);
  }
};

/**
 * Check if user is authenticated
 * @returns boolean
 */

const useAuthentication = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [authTokenKey],
    queryFn: async () => {
      const authStatus = await checkAuthentication();
      const tokenDetails = TokenService.getToken();
      if (tokenDetails) {
        queryClient.setQueryData([authTokenDetails], {
          ...tokenDetails,
        });
      }
      return authStatus;
    },
  });
};

export { checkAuthentication, useAuthentication, useLogin, useLogout };
