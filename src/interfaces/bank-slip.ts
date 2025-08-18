export interface BankSlipResponse {
  id: string;
  contractId: string;
  amountDue: string;
  amountPaid: string;
  dueDate: string;
  paidAt: string | null;
  status: string;
  bankSlip: BankSlip;
}

export interface BankSlip {
  id: string;
  paymentOrderId: string;
  asaasChargeId: string;
  bankSlipUrl: string;
  invoiceUrl: string;
  nossoNumero: string;
  createdAt: string;
  updatedAt: string;
}
