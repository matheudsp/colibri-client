import type { PaymentResponse } from "./payment";
import { PropertyProps as Property } from "./property";

export interface Contract {
  id: string;
  status:
    | "PENDENTE_DOCUMENTACAO"
    | "EM_ANALISE"
    | "AGUARDANDO_ASSINATURAS"
    | "ATIVO"
    | "FINALIZADO"
    | "CANCELADO";
  rentAmount: string;
  condoFee: string;
  iptuFee: string;
  startDate: string;
  endDate: string;
  durationInMonths: number;
  guaranteeType: string;
  securityDeposit: string;
  createdAt: string;
  updatedAt: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  property: Property;
  landlord: {
    id: string;
    name: string;
    email: string;
  };
  tenant: {
    id: string;
    name: string;
    email: string;
    cpfCnpj?: string;
    phone?: string;
    password?: string;
  };
  paymentsOrders?: PaymentResponse[];
}

export interface ContractWithDocuments extends Contract {
  documents: {
    id: string;
    status: string;
    type: string;
  }[];
  GeneratedPdf: { signatureRequests: SignatureRequest[] }[];
}
export interface SignatureRequest {
  id: string;
  requestSignatureKey: string;
  signerId: string;
}
