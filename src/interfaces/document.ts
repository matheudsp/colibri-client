export type DocumentType =
  | "IDENTIDADE_FRENTE"
  | "IDENTIDADE_VERSO"
  | "CPF"
  | "COMPROVANTE_RENDA"
  | "COMPROVANTE_ENDERECO";

export interface Document {
  id: string;
  type: DocumentType;
  url: string; // URL assinada para visualização
  status: "AGUARDANDO_APROVACAO" | "APROVADO" | "REPROVADO";
  userId: string;
  contractId: string;
  uploadedAt: string;
}
