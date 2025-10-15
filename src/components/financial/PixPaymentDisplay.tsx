"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CustomButton } from "../forms/CustomButton";
import Image from "next/image"; // Usaremos o componente Image do Next.js

interface PixPaymentDisplayProps {
  payload: string; // O "copia e cola"
  encodedImage: string; // A imagem em base64
}

export function PixPaymentDisplay({
  payload,
  encodedImage,
}: PixPaymentDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    toast.success("Código PIX copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 3000);
  };

  // Prepara o `src` para a tag de imagem com o dado em base64
  const imageSrc = `data:image/png;base64,${encodedImage}`;

  return (
    <div className="flex flex-col items-center gap-4 p-6 border border-border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">Pagar com PIX</h3>
      <div className="p-2 bg-white border rounded-md">
        {/* Exibe a imagem base64 diretamente */}
        <Image
          src={imageSrc}
          alt="PIX QR Code"
          width={192}
          height={192}
          className="w-48 h-48"
        />
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
            value={payload}
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
