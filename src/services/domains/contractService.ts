import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import { Contract, type ContractWithDocuments } from "@/interfaces/contract";

export interface CreateContractData {
  rentAmount: number;
  condoFee?: number;
  iptuFee?: number;
  securityDeposit?: number;
  startDate: string;
  durationInMonths: number;
  guaranteeType: string;
  propertyId: string;
  tenantEmail: string;
  tenantCpfCnpj?: string;
  tenantName?: string;
  tenantPassword?: string;
}

export interface ResendNotificationData {
  signerId: string;
  method: "email" | "whatsapp";
}

export const ContractService = {
  async create(data: CreateContractData): Promise<ApiResponse<Contract>> {
    try {
      const response = await api.post(API_ROUTES.CONTRACTS.CREATE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async listAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Contract[]>> {
    try {
      const response = await api.get(API_ROUTES.CONTRACTS.BASE, { params });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async findOne(id: string): Promise<ApiResponse<ContractWithDocuments>> {
    try {
      const response = await api.get(API_ROUTES.CONTRACTS.BY_ID({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async requestSignature(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(
        API_ROUTES.CONTRACTS.REQUEST_SIGNATURE({ id })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async getViewPdfUrl(id: string): Promise<ApiResponse<{ url: string }>> {
    try {
      const response = await api.get(API_ROUTES.CONTRACTS.VIEW_PDF_URL({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async cancel(id: string): Promise<ApiResponse<Contract>> {
    try {
      const response = await api.patch(API_ROUTES.CONTRACTS.CANCEL({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async resendNotification(
    id: string,
    data: ResendNotificationData
  ): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(
        API_ROUTES.CONTRACTS.RESEND_NOTIFICATION({ id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async activate(id: string): Promise<ApiResponse<Contract>> {
    try {
      const response = await api.patch(API_ROUTES.CONTRACTS.ACTIVATE({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(API_ROUTES.CONTRACTS.DELETE({ id }));
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
