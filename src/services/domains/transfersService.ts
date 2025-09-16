import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";

export enum TransferType {
  AUTOMATIC = "AUTOMATIC",
  MANUAL = "MANUAL",
}

export interface SearchTransferParams {
  page?: number;
  limit?: number;
  type?: TransferType;
}

export interface CreateManualTransferPayload {
  description?: string;
}

export interface Transfer {
  id: string;
  asaasTransferId: string;
  status: "PENDING" | "DONE" | "FAILED" | "CANCELLED";
  value: number;
  effectiveDate: string | null;
  createdAt: string;
  failReason: string | null;
  paymentOrderId: string | null; // Será nulo para transferências manuais
  paymentOrder?: {
    dueDate: string;
    contract: {
      property: { title: string };
      tenant: { name: string };
    };
  };
}

export const TransfersService = {
  /**
   * Solicita um saque manual do saldo da subconta do usuário.
   */
  async createManualTransfer(
    data: CreateManualTransferPayload
  ): Promise<ApiResponse<Transfer>> {
    try {
      const response = await api.post(API_ROUTES.TRANSFERS.MANUAL_PAYOUT, data);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Lista as transferências (repasses) do usuário logado.
   */
  async findMyTransfers(
    params?: SearchTransferParams
  ): Promise<ApiResponse<Transfer[]>> {
    try {
      const response = await api.get(API_ROUTES.TRANSFERS.MY_TRANSFERS, {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
