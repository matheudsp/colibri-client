import type { ChargeResponse } from "@/interfaces/charge";
import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";

export interface PixQrCodeResponse {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface IdentificationFieldResponse {
  identificationField: string;
}

export const ChargeService = {
  /**
   * Solicita a geração de um novo boleto para uma ordem de pagamento.
   */
  async generate(
    paymentOrderId: string,
    billingType?: "BOLETO" | "PIX"
  ): Promise<ChargeResponse> {
    try {
      const response = await api.post(API_ROUTES.CHARGE.GENERATE, {
        paymentOrderId,
        billingType,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Obtém os dados do QR Code PIX de uma cobrança existente.
   */
  async getPixQrCode(
    paymentOrderId: string
  ): Promise<ApiResponse<PixQrCodeResponse>> {
    try {
      const response = await api.get(
        API_ROUTES.CHARGE.GET_PIX_QR_CODE({ id: paymentOrderId })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Obtém a linha digitável de um boleto de uma cobrança existente.
   */
  async getBoletoIdentificationField(
    paymentOrderId: string
  ): Promise<ApiResponse<IdentificationFieldResponse>> {
    try {
      const response = await api.get(
        API_ROUTES.CHARGE.GET_BOLETO_IDENTIFICATION_FIELD({
          id: paymentOrderId,
        })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
