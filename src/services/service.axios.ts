import axios from "axios";
import TokenService from "./service-token";
const HttpClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});
HttpClient.interceptors.request.use(async (config) => {
  const token = TokenService.getToken()?.token;

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
export default HttpClient;
