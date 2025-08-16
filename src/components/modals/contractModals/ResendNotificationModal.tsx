"use client";

import { useState } from "react";
import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { Mail, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Contract } from "@/interfaces/contract";

interface ResendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signerId: string, method: "email" | "whatsapp") => void;
  isLoading: boolean;
  contract: Contract;
}

export function ResendNotificationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  contract,
}: ResendNotificationModalProps) {
  const [selectedSignerId, setSelectedSignerId] = useState<string>(
    contract.landlord.id
  );
  const [selectedMethod, setSelectedMethod] = useState<"email" | "whatsapp">(
    "email"
  );

  const handleConfirm = () => {
    onConfirm(selectedSignerId, selectedMethod);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reenviar Notificação">
      <div className="space-y-4">
        <div>
          <label className="font-semibold text-gray-700">
            Selecione o Destinatário
          </label>
          <select
            value={selectedSignerId}
            onChange={(e) => setSelectedSignerId(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value={contract.landlord.id}>
              Locador: {contract.landlord.name}
            </option>
            <option value={contract.tenant.id}>
              Inquilino: {contract.tenant.name}
            </option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">
            Selecione o Método
          </label>
          <div className="flex gap-4 mt-2">
            <CustomButton
              onClick={() => setSelectedMethod("email")}
              ghost={selectedMethod !== "email"}
              className="w-full"
            >
              <Mail className="mr-2" /> E-mail
            </CustomButton>
            <CustomButton
              onClick={() => setSelectedMethod("whatsapp")}
              ghost={selectedMethod !== "whatsapp"}
              className="w-full"
            >
              <FaWhatsapp className="mr-2" /> WhatsApp
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <CustomButton
          color="bg-gray-200"
          textColor="text-gray-800"
          onClick={onClose}
        >
          Cancelar
        </CustomButton>
        <CustomButton
          onClick={handleConfirm}
          disabled={isLoading}
          color="bg-primary"
          textColor="text-white"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Enviar Lembrete"}
        </CustomButton>
      </div>
    </Modal>
  );
}
