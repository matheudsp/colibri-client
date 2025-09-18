import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import {
  PaymentsSummaryResponseDto,
  PropertiesOccupancyResponseDto,
  RentIncomeResponseDto,
  TenantsStatusResponseDto,
} from "@/interfaces/analytics";

export const AnalyticsService = {
  async getRentIncome(period?: string): Promise<RentIncomeResponseDto> {
    try {
      const response = await api.get(API_ROUTES.ANALYTICS.RENT_INCOME, {
        params: { period },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async getTenantsStatus(): Promise<TenantsStatusResponseDto> {
    try {
      const response = await api.get(API_ROUTES.ANALYTICS.TENANTS_STATUS, {
        // params: { period },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async getPaymentsSummary(
    period?: string
  ): Promise<PaymentsSummaryResponseDto> {
    try {
      const response = await api.get(API_ROUTES.ANALYTICS.PAYMENTS_SUMMARY, {
        params: { period },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async getPropertiesOccupancy(): Promise<PropertiesOccupancyResponseDto> {
    try {
      const response = await api.get(API_ROUTES.ANALYTICS.PROPERTIES_OCCUPANCY);
      return response.data.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
