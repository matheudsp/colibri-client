"use client";

import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { Loader2 } from "lucide-react";
import { FcMoneyTransfer } from "react-icons/fc";
interface RegisterCaucaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function RegisterCaucaoModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RegisterCaucaoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Recebimento da Caução"
    >
      <div className="flex items-center justify-center mb-4">
        <FcMoneyTransfer className="w-12 h-12" />
      </div>
      <p className="text-gray-600 text-center">
        Tem certeza de que deseja registrar o recebimento da caução em dinheiro?
      </p>
      <p className="text-sm font-semibold text-red-600 mt-2 text-center">
        Esta ação ativará o contrato e não poderá ser desfeita.
      </p>

      <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3">
        <CustomButton
          color="bg-gray-200"
          textColor="text-gray-800"
          onClick={onClose}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </CustomButton>
        <CustomButton
          onClick={onConfirm}
          disabled={isLoading}
          color="bg-red-600"
          textColor="text-white"
          className="w-full sm:w-auto"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Confirmar"}
        </CustomButton>
      </div>
    </Modal>
  );
}
