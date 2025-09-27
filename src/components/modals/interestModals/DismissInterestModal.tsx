"use client";

import { useState } from "react";

import { CustomButton } from "@/components/forms/CustomButton";
import { CustomFormTextarea } from "@/components/forms/CustomFormTextarea";
import { Modal } from "../Modal";
import { LuListMinus } from "react-icons/lu";

interface DismissInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export function DismissInterestModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DismissInterestModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispensar Interesse">
      <div className="space-y-4">
        <p className="text-sm text-foreground-muted">
          Você pode adicionar uma mensagem para informar ao candidato o motivo
          da dispensa.
        </p>

        <CustomFormTextarea
          icon={<LuListMinus className="h-5 w-5" />}
          id="dismissalReason"
          label="Motivo da Dispensa (Opcional)"
          className="text-sm "
          placeholder="Ex: O imóvel já foi alugado por outro interessado."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
        />
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4">
        <CustomButton
          onClick={onClose}
          disabled={isLoading}
          ghost
          className="w-full sm:w-auto mt-2 sm:mt-0"
        >
          Cancelar
        </CustomButton>
        <CustomButton
          onClick={handleConfirm}
          disabled={isLoading}
          isLoading={isLoading}
          color="bg-secondary"
          className="w-full sm:w-auto"
        >
          Dispensar
        </CustomButton>
      </div>
    </Modal>
  );
}
