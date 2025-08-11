import { api } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";

export interface ContractResponse {
  id: string;
  status: string;
  rentAmount: number;
  condoFee?: number;
  iptuFee?: number;
  securityDeposit?: number;
  startDate: string;
  durationInMonths: number;
  guaranteeType: string;
  createdAt: string;
  updatedAt: string;
  propertyId: string;
}

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

export const ContractService = {
  async create(
    data: CreateContractData
  ): Promise<ApiResponse<ContractResponse>> {
    try {
      const response = await api.post(API_ROUTES.CONTRACTS.CREATE, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
