"use client";

import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { Loader2 } from "lucide-react";

interface RegisterPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function RegisterPaymentModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RegisterPaymentModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Recebimento">
      <p className="text-gray-600">
        Tem a certeza de que deseja dar baixa nesta fatura? Esta ação marcará a
        ordem de pagamento como{" "}
        <strong className="font-semibold text-gray-700">PAGO</strong> e não pode
        ser desfeita facilmente.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <CustomButton
          color="bg-gray-200"
          textColor="text-gray-800"
          onClick={onClose}
        >
          Cancelar
        </CustomButton>
        <CustomButton
          onClick={onConfirm}
          disabled={isLoading}
          color="bg-green-600"
          textColor="text-white"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Confirmar"}
        </CustomButton>
      </div>
    </Modal>
  );
}
