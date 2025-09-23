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
      <div className="p-6  border-gray-200 flex flex-col justify-center text-center">
        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center shadow-xs mb-3">
          <FileBadge2 className="text-yellow-600" size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Verificação Pendente
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Sua conta está em processo de verificação. Se houver algum documento
          pendente, ele aparecerá abaixo. Caso contrário, apenas aguarde nossa
          confirmação por e-mail.
        </p>
        {onboardingUrl && (
          <div className="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg flex items-center gap-2 border border-blue-200">
            <AlertCircle size={28} className="text-blue-500 shrink-0" />
            <span>
              Estamos quase lá, agora é neccessário verificar sua identidade.
              Este é um procedimento padrão para garantir a legitimidade das
              transações. Se já realizou o processo de verificação, não há
              necessidade de realiza-lo novamente, apenas aguarde.
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

      {!isLoadingDocs && pendingDocs.length > 0 && (
        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
          <h4 className="text-base font-semibold text-gray-800 text-center mb-4">
            Ações Necessárias
          </h4>
          <div className="max-w-lg mx-auto">
            <ul className="space-y-3">
              {pendingDocs.map((doc) => (
                <li
                  key={doc.type}
                  className="flex items-center justify-between p-3 rounded-lg bg-background border border-border"
                >
                  <span className="font-medium text-sm text-gray-800">
                    {doc.title}
                  </span>
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
          </div>
        </div>
      )}

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
