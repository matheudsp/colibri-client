import { pdfType } from "../constants";

export type PdfType = (typeof pdfType)[number]["value"];

export interface SignatureRequest {
  id: string;
  requestSignatureKey: string;
  signerId: string;
}

export interface PDF {
  id?: string;
  type: PdfType;
  generated: boolean;
  signed: boolean;
  filePath?: string | null;
  signedFilePath?: string | null;
}

export interface PdfDocument {
  id: string;
  projectId: string;
  name?: string;
  filePath: string;
  pdfType: PdfType;
  signedFilePath?: string | null;
  generatedAt: string;
}

export interface Pdf {
  id: string;
  filePath: string;
  pdfType: "CONTRATO_LOCACAO" | "RELATORIO_JUDICIAL";
  generatedAt: string;
  signedFilePath?: string | null;
  clicksignEnvelopeId?: string | null;
  contractId: string;
  createdAt: string;
  updatedAt: string;
  signatureRequests: SignatureRequest[];
}
