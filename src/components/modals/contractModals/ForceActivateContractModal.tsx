"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";

interface ForceActivateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ForceActivateContractModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ForceActivateContractModalProps) {
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
          <div className="fixed inset-0 bg-black bg-opacity-30" />
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
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-8 w-8 text-amber-500" />
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirmar Ativação Forçada
                  </Dialog.Title>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Você tem certeza que deseja ativar este contrato?
                  </p>
                  <p className="text-sm text-red-700 font-semibold">
                    Esta ação irá ignorar as etapas de envio e aprovação de
                    documentos, gerando os pagamentos imediatamente.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
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
                    color="bg-amber-500"
                    textColor="text-white"
                    className="hover:bg-amber-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Ativando...
                      </>
                    ) : (
                      "Sim, Ativar Contrato"
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
