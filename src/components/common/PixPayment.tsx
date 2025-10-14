"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomButton } from "../forms/CustomButton";
import Image from "next/image";
interface PixPaymentProps {
  qrCodeData: string;
  // O backend deve fornecer uma URL para a imagem do QR Code
  qrCodeImageUrl?: string;
}

export function PixPayment({ qrCodeData, qrCodeImageUrl }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCodeData);
    setCopied(true);
    toast.success("Código PIX copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">Pagar com PIX</h3>
      <div className="p-2 bg-white border rounded-md">
        {qrCodeImageUrl ? (
          <Image src={qrCodeImageUrl} alt="PIX QR Code" className="w-48 h-48" />
        ) : (
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
            <p className="text-sm text-gray-500 text-center">
              QR Code indisponível
            </p>
          </div>
        )}
      </div>
      <p className="text-sm text-center text-gray-600">
        Abra o app do seu banco e escaneie o código, ou use o &quot;Copia e
        Cola&quot;.
      </p>
      <div className="w-full">
        <label htmlFor="pix-code" className="text-xs font-medium text-gray-500">
          PIX Copia e Cola
        </label>
        <div className="flex items-center gap-2 mt-1">
          <textarea
            id="pix-code"
            readOnly
            value={qrCodeData}
            className="w-full p-2 text-xs border rounded-md bg-gray-200 text-gray-700 resize-none focus:outline-none"
            rows={3}
          />
          <CustomButton
            onClick={handleCopy}
            title="Copiar código PIX"
            className="h-full p-3"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
