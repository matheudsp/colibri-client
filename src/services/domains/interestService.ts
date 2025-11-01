import type { ApiResponse } from "@/types/api";
import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { User } from "./userService";
import type { PropertyResponse } from "./propertyService";

// Interfaces para os dados da API
export interface CreateInterestData {
  propertyId: string;
  message?: string;
}

export interface UpdateInterestStatusData {
  status: "CONTACTED" | "DISMISSED";
  dismissalReason?: string;
}

export interface Interest {
  id: string;
  message?: string;
  status: "PENDING" | "CONTACTED" | "DISMISSED";
  dismissalReason?: string;
  createdAt: string;
  property: Pick<PropertyResponse, "id" | "title" | "photos">;
  tenant: Pick<User, "id" | "name" | "email" | "cpfCnpj" | "phone">;
  landlord: Pick<User, "id" | "name">;
}

export const InterestService = {
  /**
   * Verifica se o usuário logado já demonstrou interesse em um imóvel.
   */
  async checkInterest(
    propertyId: string
  ): Promise<ApiResponse<{ hasInterested: boolean }>> {
    try {
      const response = await api.get(
        API_ROUTES.INTERESTS.CHECK({ propertyId })
      );
      return response.data;
    } catch (error) {
      // Retorna false em caso de erro para não bloquear a UI,
      // a validação final sempre será do backend.
      console.error("Failed to check interest status:", error);
      return {
        success: false,
        statusCode: 500,
        message: "Não foi possível identificar interesse",
        data: { hasInterested: false },
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Locatário: Envia uma manifestação de interesse em um imóvel.
   */
  async create(data: CreateInterestData): Promise<ApiResponse<Interest>> {
    try {
      const response = await api.post(API_ROUTES.INTERESTS.CREATE, data);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Locador: Lista todos os interesses recebidos em seus imóveis.
   */
  async listReceived(): Promise<ApiResponse<Interest[]>> {
    try {
      const response = await api.get(API_ROUTES.INTERESTS.LIST_RECEIVED);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Locatário: Lista todos os interesses que ele enviou.
   */
  async listSent(): Promise<ApiResponse<Interest[]>> {
    try {
      const response = await api.get(API_ROUTES.INTERESTS.LIST_SENT);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Locador: Atualiza o status de um interesse (CONTACTED ou DISMISSED).
   */
  async updateStatus(
    id: string,
    data: UpdateInterestStatusData
  ): Promise<ApiResponse<Interest>> {
    try {
      // console.log(data);
      const response = await api.patch(
        API_ROUTES.INTERESTS.UPDATE_STATUS({ id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
