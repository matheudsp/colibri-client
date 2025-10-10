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
  charge: Charge;
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
