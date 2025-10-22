import { api, extractAxiosError } from "../api";
import API_ROUTES from "../api/routes";
import { ApiResponse } from "@/types/api";
import type { Pdf } from "@/interfaces/pdf";
import type { NestedVariableData } from "@/types/editor";

export interface ContractTemplateResponse {
  templateHtml: string;
  templateData: NestedVariableData;
}

export const PdfService = {
  /**
   * Busca o template de contrato e os dados dinâmicos com base no ID do contrato.
   * @param contractId O ID do contrato.
   */
  async getContractTemplate(
    contractId: string
  ): Promise<ApiResponse<ContractTemplateResponse>> {
    try {
      const response = await api.get(API_ROUTES.PDFS.GET_CONTRACT_TEMPLATE, {
        params: { contractId },
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Solicita a geração de um PDF para um contrato específico.
   * @param contractId - O ID do contrato.
   * @param pdfType - O tipo de PDF a ser gerado.
   * @returns Os metadados do PDF gerado.
   */
  async generateReport(
    contractId: string,
    pdfType: "RELATORIO_JUDICIAL" | "CONTRATO_LOCACAO"
  ): Promise<ApiResponse<Pdf>> {
    try {
      const response = await api.post(API_ROUTES.PDFS.GENERATE, {
        contractId,
        pdfType,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },

  /**
   * Obtém uma URL assinada e temporária para visualizar/baixar um PDF.
   * @param id - O ID do registro do PDF.
   * @returns Um objeto contendo a URL assinada.
   */
  async getSignedUrl(id: string): Promise<ApiResponse<{ url: string }>> {
    try {
      const response = await api.get(API_ROUTES.PDFS.SIGNED_URL({ id }));
      return response.data;
    } catch (error) {
      throw new Error(extractAxiosError(error));
    }
  },
};
