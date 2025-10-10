export interface ChargeResponse {
  id: string;
  contractId: string;
  amountDue: string;
  amountPaid: string;
  dueDate: string;
  paidAt: string | null;
  status: string;
  charge: Charge;
}

export interface Charge {
  id: string;
  paymentOrderId: string;
  transactionReceiptUrl?: string;
  asaasChargeId: string;
  bankSlipUrl?: string;
  nossoNumero?: string;
  pixQrCode?: string;
  pixPayload?: string;
  invoiceUrl: string;
  createdAt: string;
  updatedAt: string;
}
