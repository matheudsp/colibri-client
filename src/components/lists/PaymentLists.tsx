"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

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
    icon: <Clock className="text-yellow-600" />,
    label: "Pendente",
    color: "text-yellow-600",
  },
  PAGO: {
    icon: <CheckCircle className="text-green-600" />,
    label: "Pago",
    color: "text-green-600",
  },
  ATRASADO: {
    icon: <Clock className="text-red-600" />,
    label: "Atrasado",
    color: "text-red-600",
  },
  CANCELADO: {
    icon: <XCircle className="text-gray-600" />,
    label: "Cancelado",
    color: "text-gray-500",
  },
  ISENTO: {
    icon: <CheckCircle className="text-blue-600" />,
    label: "Isento",
    color: "text-blue-600",
  },
  CONFIRMADO: {
    icon: <CheckCircle className="text-green-600" />,
    label: "Confirmado",
    color: "text-green-600",
  },
  FALHOU: {
    icon: <XCircle className="text-red-600" />,
    label: "Falhou",
    color: "text-red-600",
  },
  EM_REPASSE: {
    icon: <Clock className="text-blue-600" />,
    label: "Em Repasse",
    color: "text-blue-600",
  },
  RECEBIDO: {
    icon: <CheckCircle className="text-emerald-600" />,
    label: "Recebido",
    color: "text-emerald-600",
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
  const { role } = useCurrentUser();
  const canManagePayments = role === Roles.LOCADOR || role === Roles.ADMIN;

  return (
    <div className=" p-5 rounded-xl border border-border">
      <h2 className="font-bold text-xl mb-4 border-b border-border pb-2">
        Histórico de Pagamentos
      </h2>
      <ul className="divide-y divide-border">
        {payments.map((payment) => {
          const status = statusMap[payment.status] || statusMap.PENDENTE;
          const isPayable =
            payment.status === "PENDENTE" ||
            payment.status === "ATRASADO" ||
            payment.status === "FALHOU";

          return (
            <li
              key={payment.id}
              className="p-3 transition-all hover:bg-gray-100/50"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                {/* -- Informações do Pagamento -- */}
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

                {/* -- Valor e Ação -- */}
                <div className="flex items-center justify-between sm:justify-end sm:gap-4 w-full sm:w-auto">
                  <p className="font-bold text-gray-800 text-base sm:text-lg">
                    {payment.amountDue
                      ? `R$ ${formatDecimalValue(payment.amountDue.toString())}`
                      : "N/A"}
                  </p>
                  {canManagePayments && isPayable && (
                    <CustomButton
                      onClick={() => onRegisterPaymentClick(payment.id)}
                      color="bg-green-100"
                      textColor="text-green-800"
                      className="shrink-0 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <DollarSign size={16} className="mr-1 sm:mr-2" />
                      Dar Baixa
                    </CustomButton>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
