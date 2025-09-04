import { AxiosError, AxiosInstance } from "axios";
import { AuthService } from "../../domains/authService";
import { useUserStore } from "@/stores/userStore";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

export const setupResponseInterceptor = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest.url?.endsWith("/auth/refresh") &&
        !originalRequest.url?.endsWith("/auth/login")
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await AuthService.refreshToken();
            processQueue(null);
            return apiInstance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError as AxiosError);

            // Remova a chamada à API de logout e limpe o estado localmente
            useUserStore.getState().setUser(null);

            // Redireciona apenas se não estiver já na página de login
            if (window.location.pathname !== "/entrar") {
              window.location.href = "/entrar";
            }

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      return Promise.reject(error);
    }
  );
};
