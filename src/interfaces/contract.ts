import type { PaymentResponse } from "./payment";
import { PropertyProps as Property } from "./property";

export interface SignatureRequest {
  id: string;
  clicksignSignerId: string;
  status: string;
  signerId: string;
}

export interface Contract {
  id: string;
  status:
    | "EM_ELABORACAO"
    | "AGUARDANDO_ACEITE_INQUILINO"
    | "PENDENTE_DOCUMENTACAO"
    | "EM_ANALISE"
    | "AGUARDANDO_ASSINATURAS"
    | "AGUARDANDO_GARANTIA"
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
  contractHtml: string | null;
  clicksignEnvelopeId: string | null;
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
  signatureRequests: SignatureRequest[];
}
