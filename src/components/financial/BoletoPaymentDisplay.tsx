"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, FileText, ExternalLink } from "lucide-react";
import { CustomButton } from "../forms/CustomButton";

interface BoletoPaymentDisplayProps {
  identificationField: string;
  bankSlipUrl: string;
}

export function BoletoPaymentDisplay({
  identificationField,
  bankSlipUrl,
}: BoletoPaymentDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(identificationField);
    setCopied(true);
    toast.success("Linha digitável copiada!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-gray-50">
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-800">
          Pagamento com Boleto
        </h3>
      </div>
      <p className="text-sm text-center text-gray-600">
        Copie a linha digitável abaixo e pague no app do seu banco, ou clique
        para abrir o boleto em PDF.
      </p>
      <div className="w-full">
        <label
          htmlFor="boleto-code"
          className="text-xs font-medium text-gray-500"
        >
          Linha Digitável
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            id="boleto-code"
            readOnly
            value={identificationField}
            className="w-full p-2 text-xs border rounded-md bg-gray-200 text-gray-700 focus:outline-none truncate"
          />
          <CustomButton
            onClick={handleCopy}
            title="Copiar linha digitável"
            className="h-full p-3"
            ghost
          >
            {copied ? (
              <Check size={18} className="text-green-600" />
            ) : (
              <Copy size={18} />
            )}
          </CustomButton>
        </div>
      </div>
      <CustomButton
        onClick={() => window.open(bankSlipUrl, "_blank")}
        className="w-full mt-2"
        color="bg-secondary"
        textColor="text-white"
      >
        <ExternalLink size={16} className="mr-2" />
        Abrir Boleto em PDF
      </CustomButton>
    </div>
  );
}
