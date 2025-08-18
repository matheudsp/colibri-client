"use client";

import { useUserRole } from "@/hooks/useUserRole";

import { PaymentResponse } from "@/interfaces/payment";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";
import { Roles, type PaymentStatus } from "@/constants";
import { CustomButton } from "../forms/CustomButton";
import { JSX } from "react";

type StatusInfo = {
  icon: JSX.Element;
  label: string;
  color: string;
};

const statusMap: Record<PaymentStatus, StatusInfo> = {
  PENDENTE: {
    icon: <Clock className="text-yellow-500" />,
    label: "Pendente",
    color: "text-yellow-600",
  },
  PAGO: {
    icon: <CheckCircle className="text-green-500" />,
    label: "Pago",
    color: "text-green-600",
  },
  ATRASADO: {
    icon: <Clock className="text-red-500" />,
    label: "Atrasado",
    color: "text-red-600",
  },
  CANCELADO: {
    icon: <XCircle className="text-gray-500" />,
    label: "Cancelado",
    color: "text-gray-500",
  },
  ISENTO: {
    icon: <CheckCircle className="text-blue-500" />,
    label: "Isento",
    color: "text-blue-600",
  },
  CONFIRMADO: {
    icon: <CheckCircle className="text-green-500" />,
    label: "Confirmado",
    color: "text-green-600",
  },
  FALHOU: {
    icon: <XCircle className="text-red-500" />,
    label: "Falhou",
    color: "text-red-600",
  },
};

interface PaymentsListProps {
  payments: PaymentResponse[];
  onRegisterPaymentClick: (paymentId: string) => void;
}

export function PaymentsList({
  payments,
  onRegisterPaymentClick,
}: PaymentsListProps) {
  const { role } = useUserRole();
  const canManagePayments = role === Roles.LOCADOR || role === Roles.ADMIN;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h2 className="font-bold text-xl mb-4 border-b pb-2">
        Histórico de Pagamentos
      </h2>
      <ul className="space-y-3">
        {payments.map((payment) => {
          const status = statusMap[payment.status] || statusMap.PENDENTE;
          const isPayable =
            payment.status === "PENDENTE" || payment.status === "ATRASADO";

          return (
            <li
              key={payment.id}
              className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                {status.icon}
                <div className="flex-1">
                  <p className={`font-semibold ${status.color}`}>
                    {status.label}
                  </p>
                  <p className="text-sm text-gray-500">
                    Vencimento: {formatDateForDisplay(payment.dueDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <p className="font-bold text-gray-800">
                  {payment.amountDue
                    ? `R$ ${formatDecimalValue(payment.amountDue.toString())}`
                    : "N/A"}
                </p>
                {canManagePayments && isPayable && (
                  <CustomButton
                    onClick={() => onRegisterPaymentClick(payment.id)}
                    color="bg-green-100"
                    textColor="text-green-800"
                  >
                    <DollarSign size={16} className="mr-2" />
                    Dar Baixa
                  </CustomButton>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
