import type { PaymentStatus } from "@/constants";
import type { Charge } from "./charge";

export interface PaymentResponse {
  id: string;
  amountDue: string;
  amountPaid: string | null;
  dueDate: string;
  paidAt: string | null;
  status: PaymentStatus;
  contractId: string;
  charge: Charge | null;
  isSecurityDeposit?: boolean;
  contract: {
    rentAmount?: string;
    iptuFee?: string;
    condoFee?: string;
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
