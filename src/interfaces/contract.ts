import { PropertyProps as Property } from "./property";

export interface PaymentOrder {
  id: string;
  amountDue: number;
  dueDate: string;
  status: "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO";
}

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
  };
  paymentsOrders?: PaymentOrder[];
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
