import { toast } from "@/components/ui/toast";
import router from "@/router";
import axios from "axios";
import TokenService from "./service-token";
const HttpClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});
HttpClient.interceptors.request.use(async (config) => {
  const token = TokenService.getToken();

  if (config && config.headers) {
    if (token && config.headers["Authorization"] !== "") {
      config.headers["Authorization"] = "Bearer " + token;
    }
    if (config.headers["Authorization"] === "") {
      delete config.headers["Authorization"];
    }
  }
  return config;
});
HttpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log(error);
      console.log(error.response);
      if (error.response.status === 401) {
        // Redirect to login page
        router.push("/login");
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: error?.response?.data?.message,
        });
      }
    }
    return Promise.reject(error);
  }
);
export default HttpClient;
