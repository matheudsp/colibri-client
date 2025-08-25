import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1/";
const TIMEOUT_25_SECONDS = 25 * 1000;

const axiosConfig: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: TIMEOUT_25_SECONDS,
  withCredentials: true,
};

export const api: AxiosInstance = axios.create(axiosConfig);

export const extractAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const responseData = error.response.data;

    if (typeof responseData.message === "string") {
      return responseData.message;
    }

    if (typeof responseData.error === "string") {
      return responseData.error;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível conectar ao servidor. Tente novamente mais tarde.";
};
