"use client";

import React from "react";
import { PaymentResponse } from "@/interfaces/payment";
import { DropdownMenu } from "./DropdownMenu";
import {
  Eye,
  FileText,
  DownloadCloud,
  BanknoteArrowDown,
  MoreVertical,
  Loader,
  Loader2,
} from "lucide-react";

type Props = {
  payment: PaymentResponse;
  loading?: boolean;
  onOpenUrl?: (url: string) => void;
  onGenerateSlip: (paymentId: string) => Promise<void> | void;
  onRegister: (paymentId: string) => void;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export function PaymentActionsDropdown({
  payment,
  loading,
  onOpenUrl,
  onGenerateSlip,
  onRegister,
  className = "",
  onOpenChange,
}: Props) {
  const canViewReceipt =
    ["PAGO", "RECEBIDO", "EM_REPASSE", "CONFIRMADO"].includes(payment.status) &&
    !!payment.charge?.transactionReceiptUrl;
  const canViewBankSlip = !!payment.charge?.bankSlipUrl;
  const canGenerateSlip = ["PENDENTE", "ATRASADO", "FALHOU"].includes(
    payment.status
  );

  const canRegister = canGenerateSlip;

  const openUrl = (url?: string) => {
    if (!url) return;
    if (onOpenUrl) return onOpenUrl(url);
    window.open(url, "_blank");
  };

  const handleGenerate = async () => {
    if (!canGenerateSlip) return;
    await onGenerateSlip(payment.id);
  };

  const handleViewReceipt = () => {
    if (!canViewReceipt) return;
    openUrl(payment.charge!.transactionReceiptUrl!);
  };

  const handleViewBankSlip = () => {
    if (!canViewBankSlip) return;
    openUrl(payment.charge!.bankSlipUrl!);
  };

  const handleRegister = () => {
    if (!canRegister) return;
    onRegister(payment.id);
  };

  const items = [
    {
      label: "Visualizar comprovante",
      action: handleViewReceipt,
      icon: loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Eye size={16} />
      ),
      disabled: !canViewReceipt,
    },
    {
      label: "Visualizar boleto",
      action: handleViewBankSlip,
      icon: loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <FileText size={16} />
      ),
      disabled: !canViewBankSlip,
    },
    {
      label: "Gerar boleto",
      action: handleGenerate,
      icon: loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <DownloadCloud size={16} />
      ),
      disabled: !canGenerateSlip || loading || !!payment.charge?.bankSlipUrl,
    },
    {
      label: "Dar baixa",
      action: handleRegister,
      icon: loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <BanknoteArrowDown size={16} />
      ),
      disabled: !canRegister || loading,
    },
  ];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <DropdownMenu
        trigger={
          <button
            type="button"
            className="p-2 w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 border-border border transition cursor-pointer"
            aria-label="Abrir menu de ações do pagamento"
            title="Abrir menu de ações do pagamento"
          >
            {loading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <MoreVertical size={16} />
            )}
          </button>
        }
        items={items}
        side="right"
        align="end"
        onOpenChange={onOpenChange ?? (() => {})}
      />
    </div>
  );
}
