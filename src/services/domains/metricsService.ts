import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";

export interface PaymentMetrics {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}

export const MetricsService = {
  /**
   * Retorna dados mockados para o gráfico de pagamentos.
   * Em um ambiente real, esta função faria uma chamada à API.
   */
  async getPaymentMetrics(): Promise<ApiResponse<PaymentMetrics>> {
    console.log("CHAMANDO getPaymentMetrics (MOCKADO)");

    // Simula um pequeno atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Dados de exemplo que serão retornados
    const mockData: PaymentMetrics = {
      totalPaid: 12560.5,
      totalPending: 4850.0,
      totalOverdue: 1200.75,
    };

    // Retorna os dados no formato esperado pela aplicação (ApiResponse)
    return Promise.resolve({
      success: true,
      statusCode: 200,
      data: mockData,
      message: "Métricas de pagamento obtidas com sucesso (Mockado)",
    });

    /*
    // CÓDIGO ORIGINAL PARA QUANDO O BACKEND ESTIVER PRONTO
    try {
      const response = await api.get(API_ROUTES.METRICS);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
    */
  },
};
