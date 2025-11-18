import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: "http://172.20.10.4:3000", // replace with your NestJS backend
  timeout: 10000,
});

// Attach bearer token automatically if present
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("donor_token");
    if (token) {
      config.headers = config.headers ?? {};
      // @ts-ignore
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});
