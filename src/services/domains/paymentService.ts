import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import { PaymentResponse } from "@/interfaces/payment";
import type { PaymentStatus } from "@/constants/payment";

export interface RegisterPaymentData {
  amountPaid?: number;
  paidAt?: string;
}
export interface PaymentFilters {
  propertyId?: string;
  status?: PaymentStatus;
  tenantId?: string;
  startDate?: string;
  endDate?: string;
}

export const PaymentService = {
  /**
   * Busca todos os pagamentos relacionados ao utilizador logado, com filtros opcionais.
   */
  async findUserPayments(
    filters?: PaymentFilters
  ): Promise<ApiResponse<PaymentResponse[]>> {
    try {
      // Passa os filtros como query params para a API
      const response = await api.get(API_ROUTES.PAYMENTS.USER_PAYMENTS, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async findByContract(
    contractId: string
  ): Promise<ApiResponse<PaymentResponse[]>> {
    try {
      const response = await api.get(
        API_ROUTES.PAYMENTS.BY_CONTRACT({ id: contractId })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Regista um pagamento manualmente (dá baixa numa fatura).
   */
  async register(
    paymentOrderId: string,
    data: RegisterPaymentData
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await api.patch(
        API_ROUTES.PAYMENTS.REGISTER({ id: paymentOrderId }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  /**
   * Busca todos os pagamentos do utilizador logado.
   */
  async findMyPayments(): Promise<ApiResponse<PaymentResponse[]>> {
    try {
      const response = await api.get(API_ROUTES.PAYMENTS.MY_PAYMENTS);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
