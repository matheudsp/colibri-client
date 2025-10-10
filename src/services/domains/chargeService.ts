import type { ChargeResponse } from "@/interfaces/charge";
import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";

export const ChargeService = {
  /**
   * Solicita a geração de um novo boleto para uma ordem de pagamento.
   */
  async generate(paymentOrderId: string): Promise<ChargeResponse> {
    try {
      const response = await api.post(API_ROUTES.CHARGE.GENERATE, {
        paymentOrderId,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
