import type { BankSlipResponse } from "@/interfaces/bank-slip";
import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";

export const BankSlipService = {
  /**
   * Solicita a geração de um novo boleto para uma ordem de pagamento.
   */
  async generate(paymentOrderId: string): Promise<BankSlipResponse> {
    try {
      const response = await api.post(API_ROUTES.BANKSLIP.GENERATE, {
        paymentOrderId,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
