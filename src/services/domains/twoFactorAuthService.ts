import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";

export interface TwoFactorAuthResponse {
  message: string;
}

export const TwoFactorAuthService = {
  /**
   * Inicia o processo de habilitação do 2FA, solicitando o envio de um código OTP.
   */
  async enable(): Promise<ApiResponse<TwoFactorAuthResponse>> {
    try {
      const response = await api.post(API_ROUTES.TWO_FACTOR_AUTH.ENABLE);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Confirma a habilitação do 2FA com o código OTP.
   */
  async confirmEnable(
    code: string
  ): Promise<ApiResponse<TwoFactorAuthResponse>> {
    try {
      const response = await api.post(
        API_ROUTES.TWO_FACTOR_AUTH.CONFIRM_ENABLE,
        { code }
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Desabilita o 2FA com um código OTP de confirmação.
   */
  async disable(code: string): Promise<ApiResponse<TwoFactorAuthResponse>> {
    try {
      const response = await api.post(API_ROUTES.TWO_FACTOR_AUTH.DISABLE, {
        code,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
