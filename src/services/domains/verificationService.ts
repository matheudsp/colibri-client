import type { ApiResponse, VerificationApiResponse } from "@/types/api";
import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { type VerificationContext } from "@/constants/VerificationContexts";
export const VerificationService = {
  /**
   * Solicita ao backend o envio de um código OTP para o usuário.
   * @param context - A razão pela qual a verificação é necessária.
   */
  async request(
    context: VerificationContext
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post(API_ROUTES.VERIFICATION.REQUEST, {
        context,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Confirma o código OTP enviado pelo usuário.
   * @param context - O mesmo contexto usado na solicitação.
   * @param otp - O código de 6 dígitos inserido pelo usuário.
   * @returns Uma promessa que resolve com um token de ação para a operação crítica.
   */
  async confirm(
    context: VerificationContext,
    otp: string
  ): Promise<ApiResponse<VerificationApiResponse>> {
    try {
      const response = await api.post(API_ROUTES.VERIFICATION.CONFIRM, {
        context,
        code: otp,
      });
      // console.log("AQUI ESTA O RETORNO DO ACTION TOKEN ->", response.data);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
