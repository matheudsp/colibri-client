import { PaymentResponse } from "@/interfaces/payment";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { CustomButton } from "../forms/CustomButton";
import { DownloadCloud, Eye, Loader2 } from "lucide-react";
import { statusMap } from "@/constants/paymentStatusMap";

export const PaymentCard = ({
  payment,
  generatingSlipId,
  handleGenerateSlip,
}: {
  payment: PaymentResponse;
  generatingSlipId: string | null;
  handleGenerateSlip: (paymentId: string) => void;
}) => {
  const isPaid = new Set(["PAGO", "RECEBIDO", "EM_REPASSE", "CONFIRMADO"]).has(
    payment.status
  );
  const isPayable = new Set(["PENDENTE", "ATRASADO", "FALHOU"]).has(
    payment.status
  );
  const statusInfo = statusMap[payment.status];

  return (
    <div className="bg-white rounded-lg shadow-md border border-border mb-4 overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 flex-1 mr-2">
            {payment.contract.property?.title || "Sem título"}
          </h3>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1.5 border ${statusInfo.color}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Pagador: {payment.contract.tenant?.name || "N/A"}
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Vencimento:</span>
          <span className="text-gray-800 font-semibold">
            {formatDateForDisplay(payment.dueDate)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Valor:</span>
          <span className="text-gray-800 font-bold text-base">
            R$ {formatDecimalValue(payment.amountDue)}
          </span>
        </div>
      </div>
      <div className="bg-gray-50 p-4 flex justify-center">
        {isPaid && payment.bankSlip?.transactionReceiptUrl ? (
          <CustomButton
            onClick={() =>
              window.open(payment.bankSlip.transactionReceiptUrl, "_blank")
            }
            color="bg-blue-100"
            textColor="text-blue-800"
            className="w-full"
          >
            <Eye size={16} className="mr-1" /> Visualizar Comprovante
          </CustomButton>
        ) : payment.bankSlip ? (
          <CustomButton
            onClick={() => window.open(payment.bankSlip.bankSlipUrl, "_blank")}
            color="bg-gray-200"
            textColor="text-black"
            className="w-full"
          >
            <Eye size={16} className="mr-1" /> Visualizar Boleto
          </CustomButton>
        ) : isPayable ? (
          <CustomButton
            onClick={() => handleGenerateSlip(payment.id)}
            color="bg-orange-500"
            textColor="text-white"
            disabled={generatingSlipId === payment.id}
            className="w-full"
          >
            {generatingSlipId === payment.id ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <DownloadCloud size={16} className="mr-1" />
            )}
            Gerar Boleto
          </CustomButton>
        ) : null}
      </div>
    </div>
  );
};
