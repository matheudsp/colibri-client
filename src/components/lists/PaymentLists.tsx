import { PaymentOrder } from "@/interfaces/contract";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";

const statusMap = {
  PENDENTE: {
    icon: <Clock className="text-yellow-500" />,
    label: "Pendente",
  },
  PAGO: { icon: <CheckCircle className="text-green-500" />, label: "Pago" },
  ATRASADO: { icon: <Clock className="text-red-500" />, label: "Atrasado" },
  CANCELADO: {
    icon: <XCircle className="text-gray-500" />,
    label: "Cancelado",
  },
};

export function PaymentsList({ payments }: { payments: PaymentOrder[] }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h2 className="font-bold text-xl mb-4 border-b pb-2">
        Histórico de Pagamentos
      </h2>
      <ul className="space-y-3">
        {payments.map((payment) => {
          const status = statusMap[payment.status] || statusMap.PENDENTE;
          return (
            <li
              key={payment.id}
              className="flex flex-col sm:flex-row justify-between sm:items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {status.icon}
                  <span className="font-semibold">{status.label}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2 sm:mt-0">
                <p>Vencimento: {formatDateForDisplay(payment.dueDate)}</p>
                <p className="font-bold">
                  Valor: R$ {formatDecimalValue(payment.amountDue.toString())}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
