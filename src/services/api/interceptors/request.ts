"use client";

import { AxiosInstance } from "axios";

export const setupRequestInterceptor = (api: AxiosInstance) => {
  api.interceptors.request.use(
    async (config) => {
      // console.group(
      //   `[Axios] Requisição: ${config.method?.toUpperCase()} ${config.url}`
      // );
      // console.info("Config:", {
      //   method: config.method,
      //   url: config.url,
      //   headers: config.headers,
      //   params: config.params,
      //   data: config.data,
      // });
      // console.groupEnd();

      return config;
    },
    (error) => {
      // console.error("[Axios] Erro no interceptor de requisição:", error);
      return Promise.reject(error);
    }
  );
};
