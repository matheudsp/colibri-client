import { DownloadCloud, Eye, Loader } from "lucide-react";
import { CustomButton } from "../forms/CustomButton";
import { PaymentResponse } from "@/interfaces/payment";
interface Props {
  payment: PaymentResponse;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
  onOpenUrl?: (url: string) => void;
  onGenerateSlip: (paymentId: string) => Promise<void> | void;
}
export function WildcardPaymentButton({
  payment,
  onGenerateSlip,
  loading,
}: Props) {
  const isPaid = new Set(["PAGO", "RECEBIDO", "EM_REPASSE", "CONFIRMADO"]).has(
    payment.status
  );
  const isPayable = new Set(["PENDENTE", "ATRASADO", "FALHOU"]).has(
    payment.status
  );
  const canGenerateSlip = ["PENDENTE", "ATRASADO", "FALHOU"].includes(
    payment.status
  );
  const handleGenerate = async () => {
    if (!canGenerateSlip) return;
    await onGenerateSlip(payment.id);
  };
  return (
    <div className="w-full  items-center justify-center">
      {isPaid && payment.bankSlip?.transactionReceiptUrl ? (
        <CustomButton
          onClick={() =>
            window.open(payment.bankSlip.transactionReceiptUrl, "_blank")
          }
          color="bg-blue-100"
          textColor="text-blue-800"
          className="w-full"
          icon={<Eye size={16} />}
          disabled={!payment.bankSlip?.transactionReceiptUrl}
        >
          Visualizar Comprovante
        </CustomButton>
      ) : payment.bankSlip ? (
        <CustomButton
          onClick={() => window.open(payment.bankSlip.bankSlipUrl, "_blank")}
          color="bg-gray-200"
          textColor="text-black"
          className="w-full"
          icon={<Eye size={16} />}
          disabled={!payment.bankSlip?.bankSlipUrl}
        >
          Visualizar Boleto
        </CustomButton>
      ) : isPayable ? (
        <CustomButton
          onClick={() => handleGenerate()}
          color="bg-orange-500"
          textColor="text-white"
          className="w-full"
          icon={
            loading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <DownloadCloud size={16} />
            )
          }
          disabled={!canGenerateSlip || loading}
        >
          Gerar Boleto
        </CustomButton>
      ) : null}
    </div>
  );
}
