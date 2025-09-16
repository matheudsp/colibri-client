import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";

// Define a estrutura esperada para um documento pendente
export interface PendingDocument {
  type: string; // ex: "SOCIAL_CONTRACT"
  title: string; // ex: "Contrato Social"
}

export const SubaccountService = {
  /**
   * Busca a lista de documentos que ainda precisam ser enviados para a sub-conta.
   */
  async getPendingDocuments(): Promise<ApiResponse<PendingDocument[]>> {
    try {
      const response = await api.get(API_ROUTES.SUBACCOUNTS.PENDING_DOCUMENTS);
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Envia um arquivo de documento para a sub-conta.
   * @param file - O arquivo a ser enviado.
   * @param type - O tipo do documento, conforme retornado pela API de pendências.
   */
  async uploadDocument(
    file: File,
    type: string
  ): Promise<ApiResponse<{ message: string }>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await api.post(
        API_ROUTES.SUBACCOUNTS.UPLOAD_DOCUMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
