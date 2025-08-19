"use client";

import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { Loader2, Trash2 } from "lucide-react";

interface DeletePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeletePropertyModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeletePropertyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
      <p className="text-gray-600">
        Tem a certeza de que deseja excluir este imóvel? Todos os dados
        associados a ele (contratos, documentos, fotos e pagamentos) serão
        removidos permanentemente.
      </p>
      <p className="font-semibold text-red-600 mt-2">
        Esta ação não pode ser desfeita.
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
          color="bg-red-600"
          textColor="text-white"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Trash2 size={16} className="mr-2" />
              Excluir
            </>
          )}
        </CustomButton>
      </div>
    </Modal>
  );
}
