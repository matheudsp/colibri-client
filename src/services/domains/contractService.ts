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
  tenantEmail?: string;
  tenantCpfCnpj: string;
  tenantName?: string;
  tenantPassword?: string;
}
export interface UpdateContractHtmlData {
  contractHtml: string;
}

export interface ResendNotificationData {
  signerId: string;
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
  async updateContractHtml(
    id: string,
    data: UpdateContractHtmlData
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.patch(
        API_ROUTES.CONTRACTS.UPDATE_HTML({ id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  /**
   * Busca o HTML renderizado do contrato para revisão e aceite do inquilino.
   */
  async getContractForReview(
    id: string
  ): Promise<ApiResponse<{ renderedHtml: string }>> {
    try {
      const response = await api.get(API_ROUTES.CONTRACTS.REVIEW({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async tenantAcceptsContract(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.patch(API_ROUTES.CONTRACTS.ACCEPT({ id }), {});
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
  async requestAlteration(
    id: string,
    data: { reason: string }
  ): Promise<ApiResponse<Contract>> {
    try {
      const response = await api.patch(
        API_ROUTES.CONTRACTS.REQUEST_ALTERATION({ id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
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

  async requestSignature(id: string): Promise<void> {
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
  ): Promise<void> {
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
