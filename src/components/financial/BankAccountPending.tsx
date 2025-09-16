"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Loader2, FileBadge2, Upload, AlertCircle } from "lucide-react";

import {
  SubaccountService,
  PendingDocument,
} from "@/services/domains/subaccountService";
import { BankAccount } from "@/services/domains/bankAccountService";
import { CustomButton } from "@/components/forms/CustomButton";
import { extractAxiosError } from "@/services/api";

interface BankAccountPendingProps {
  account: BankAccount;
}

export function BankAccountPending({ account }: BankAccountPendingProps) {
  const [pendingDocs, setPendingDocs] = useState<PendingDocument[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPendingDocs = async () => {
      setIsLoadingDocs(true);
      try {
        const response = await SubaccountService.getPendingDocuments();
        setPendingDocs(response.data);
      } catch (error) {
        toast.error("Erro ao buscar documentos pendentes.", {
          description: extractAxiosError(error),
        });
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchPendingDocs();
  }, []);

  const handleUploadClick = (docType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("data-doc-type", docType);
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const docType = event.target.getAttribute("data-doc-type");

    if (!file || !docType) return;

    setIsUploading(docType);
    try {
      const docTitle =
        pendingDocs.find((d) => d.type === docType)?.title || "Documento";
      await SubaccountService.uploadDocument(file, docType);
      toast.success(`"${docTitle}" enviado com sucesso!`);
      // Refetch documents to update list
      const response = await SubaccountService.getPendingDocuments();
      setPendingDocs(response.data);
    } catch (error) {
      toast.error("Erro ao enviar documento", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsUploading(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onboardingUrl = account.subAccount?.onboardingUrl;

  return (
    <div className="overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col justify-center text-center">
        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-sm mb-3">
          <FileBadge2 className="text-yellow-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Verificação Pendente
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Sua conta está em processo de verificação. Conclua as etapas
          necessárias para começar a receber.
        </p>
        {onboardingUrl && (
          <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg flex items-center gap-2 border border-blue-200">
            <AlertCircle size={28} className="text-blue-500 flex-shrink-0" />
            <span>
              Estaumos quase lá, agora é neccessário verificar sua identidade.
              Este é um procedimento padrão para garantir a legitimidade das
              transações.
            </span>
          </div>
        )}
        {onboardingUrl && (
          <CustomButton
            onClick={() => window.open(onboardingUrl, "_blank")}
            className="mt-3"
          >
            Completar cadastro
          </CustomButton>
        )}
      </div>

      <div className="border-t border-gray-200 py-6 md:px-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Documentos Necessários para Verificação
        </h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Para ativar sua conta de pagamentos e garantir a segurança de suas
          transações, precisamos que você envie os seguintes documentos. Nossa
          equipe irá analisá-los em breve.
        </p>
        {isLoadingDocs ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : pendingDocs.length > 0 ? (
          <ul className="space-y-3">
            {pendingDocs.map((doc) => (
              <li
                key={doc.type}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border"
              >
                <span className="font-medium">{doc.title}</span>
                <CustomButton
                  onClick={() => handleUploadClick(doc.type)}
                  disabled={!!isUploading}
                  ghost
                >
                  {isUploading === doc.type ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" /> Enviar
                    </>
                  )}
                </CustomButton>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">
            Nenhum documento adicional é necessário no momento.
          </p>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,application/pdf"
      />
    </div>
  );
}
