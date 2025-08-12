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
    name: string;
  };
  tenant: {
    name: string;
  };
  paymentsOrders?: PaymentOrder[];
}
