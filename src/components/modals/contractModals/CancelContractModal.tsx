"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Trash2Icon, Loader2 } from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CancelContractModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900 flex items-center gap-2"
                >
                  <Trash2Icon className="text-error" />
                  Confirmar Cancelamento
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Tem certeza de que deseja cancelar este contrato? Esta ação
                    é irreversível.
                  </p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <CustomButton
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    color="bg-gray-100"
                    textColor="text-gray-800"
                    className="hover:bg-gray-200"
                  >
                    Cancelar
                  </CustomButton>
                  <CustomButton
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading}
                    color="bg-error"
                    textColor="text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Cancelar"
                    )}
                  </CustomButton>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
