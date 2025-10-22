import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import { PaymentResponse } from "@/interfaces/payment";
import type { PaymentStatus } from "@/constants/payment";

export interface RegisterPaymentData {
  amountPaid?: number;
  paidAt?: string;
}
export interface PaymentFilters extends ListPaymentParams {
  propertyId?: string;
  status?: PaymentStatus;
  tenantId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListPaymentParams {
  page?: number;
  limit?: number;
}
export const PaymentService = {
  async findById(
    paymentOrderId: string
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await api.get(
        API_ROUTES.PAYMENTS.BY_ID({ id: paymentOrderId })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  /**
   * Busca todos os pagamentos relacionados ao utilizador logado, com filtros opcionais.
   */
  async findUserPayments(
    filters?: PaymentFilters
  ): Promise<ApiResponse<PaymentResponse[]>> {
    try {
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
  async confirmCashPayment(
    paymentOrderId: string,
    data: RegisterPaymentData
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await api.post(
        API_ROUTES.PAYMENTS.CONFIRM_CASH_PAYMENT({ id: paymentOrderId }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Registra o recebimento do Depósito Caução em dinheiro
   */
  async confirmSecurityCashPayment(
    paymentOrderId: string,
    data: RegisterPaymentData
  ): Promise<ApiResponse<PaymentResponse>> {
    try {
      const response = await api.post(
        API_ROUTES.PAYMENTS.CONFIRM_SECURITY_CASH_PAYMENT({
          id: paymentOrderId,
        }),
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
