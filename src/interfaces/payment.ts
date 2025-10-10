import type { PaymentStatus } from "@/constants";
import type { BankSlip } from "./charge";

export interface PaymentResponse {
  id: string;
  amountDue: string;
  amountPaid: string | null;
  dueDate: string;
  paidAt: string | null;
  status: PaymentStatus;
  contractId: string;
  bankSlip: BankSlip;
  contract: {
    property: {
      id: string;
      title: string;
    };
    tenant?: {
      id: string;
      name: string;
    };
  };
}
