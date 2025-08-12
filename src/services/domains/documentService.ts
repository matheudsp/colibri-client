import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import { Document, DocumentType } from "@/interfaces/document";

export interface UpdateDocumentStatusData {
  status: "APROVADO" | "REPROVADO";
  rejectionReason?: string;
}

export const DocumentService = {
  async uploadDocument(
    contractId: string,
    file: File,
    type: DocumentType
  ): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await api.post(
        API_ROUTES.DOCUMENTS.UPLOAD({ contractId }),
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

  async findByContract(contractId: string): Promise<ApiResponse<Document[]>> {
    try {
      const response = await api.get(
        API_ROUTES.DOCUMENTS.BY_CONTRACT({ contractId })
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  async updateStatus(
    documentId: string,
    data: UpdateDocumentStatusData
  ): Promise<ApiResponse<Document>> {
    try {
      const response = await api.patch(
        API_ROUTES.DOCUMENTS.UPDATE({ documentId }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
