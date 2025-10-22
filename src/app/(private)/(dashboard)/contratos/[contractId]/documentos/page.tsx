"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  FileText,
  Check,
  X,
  Eye,
  Upload,
  CheckCircle2,
  XCircle,
  FileClock,
} from "lucide-react";

import { Document, DocumentType } from "@/interfaces/document";
import { DocumentService } from "@/services/domains/documentService";
import { CustomButton } from "@/components/forms/CustomButton";
import { ContractService } from "@/services/domains/contractService";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { extractAxiosError } from "@/services/api";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";

const documentTypeConfig: Record<
  DocumentType,
  { label: string; description: string }
> = {
  IDENTIDADE_FRENTE: {
    label: "Identidade (Frente)",
    description: "RG ou CNH (lado da foto)",
  },
  IDENTIDADE_VERSO: {
    label: "Identidade (Verso)",
    description: "Lado de trás do seu RG ou CNH",
  },
  CPF: {
    label: "CPF",
    description: "Caso não esteja na identidade",
  },
  COMPROVANTE_RENDA: {
    label: "Comprovante de Renda",
    description: "Holerite, extrato ou declaração",
  },
  COMPROVANTE_ENDERECO: {
    label: "Comprovante de Endereço",
    description: "Conta de luz, água, etc.",
  },
};

const requiredDocs: DocumentType[] = [
  "IDENTIDADE_FRENTE",
  "IDENTIDADE_VERSO",
  "CPF",
  "COMPROVANTE_RENDA",
];

// --- Componente para a Linha de Upload do Inquilino ---
function DocumentUploadRow({
  docType,
  uploadedDoc,
  contractId,
  onUploadSuccess,
}: {
  docType: DocumentType;
  uploadedDoc?: Document;
  contractId: string;
  onUploadSuccess: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await DocumentService.uploadDocument(contractId, file, docType);
      toast.success(`"${documentTypeConfig[docType].label}" enviado!`);
      onUploadSuccess();
    } catch (error) {
      toast.error(`Erro ao enviar: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const statusConfig = {
    APROVADO: {
      icon: <CheckCircle2 className="text-green-500" />,
      text: "Aprovado",
      textColor: "text-green-600",
    },
    REPROVADO: {
      icon: <XCircle className="text-red-500" />,
      text: "Reprovado",
      textColor: "text-red-600",
    },
    AGUARDANDO_APROVACAO: {
      icon: <FileClock className="text-yellow-500" />,
      text: "Em Análise",
      textColor: "text-yellow-600",
    },
    PENDENTE: {
      icon: <Upload className="text-zinc-400" />,
      text: "Pendente",
      textColor: "text-zinc-500",
    },
  };

  const currentStatus = uploadedDoc?.status || "PENDENTE";
  const { icon, text, textColor } =
    statusConfig[currentStatus as keyof typeof statusConfig];
  const isApproved = currentStatus === "APROVADO";

  const handleButtonClick = () => {
    if (isApproved && uploadedDoc?.url) {
      window.open(uploadedDoc.url, "_blank");
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border gap-3">
      <div className="flex items-center gap-4">
        <div className="shrink-0">{icon}</div>
        <div>
          <p className="font-semibold text-zinc-800">
            {documentTypeConfig[docType].label}
          </p>
          <p className="text-xs text-zinc-500">
            {documentTypeConfig[docType].description}
          </p>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,application/pdf"
      />
      <div className="flex items-center gap-2 self-end sm:self-center">
        <span className={`text-xs font-bold w-24 text-right ${textColor}`}>
          {text}
        </span>
        <CustomButton onClick={handleButtonClick} disabled={isUploading} ghost>
          {isUploading ? (
            <Loader2 className="animate-spin" />
          ) : isApproved ? (
            <>
              <Eye size={16} className="mr-1" /> Visualizar
            </>
          ) : (
            <>{uploadedDoc ? "Substituir" : "Enviar"}</>
          )}
        </CustomButton>
      </div>
    </li>
  );
}
// --- Componente para a Linha de Verificação do Locador ---
function DocumentReviewRow({
  doc,
  onUpdateStatus,
  actionLoadingId,
}: {
  doc: Document;
  onUpdateStatus: (id: string, status: "APROVADO" | "REPROVADO") => void;
  actionLoadingId: string | null;
}) {
  const isLoading = actionLoadingId === doc.id;
  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg  border border-border gap-3">
      <div>
        <p className="font-semibold text-zinc-800">
          {documentTypeConfig[doc.type]?.label || doc.type}
        </p>
        <p className="text-xs text-zinc-500">
          Enviado em: {formatDateForDisplay(doc.uploadedAt)}
        </p>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        <a href={doc.url} target="_blank" rel="noopener noreferrer">
          <CustomButton ghost>
            <Eye size={16} className="mr-2" /> Visualizar
          </CustomButton>
        </a>
        <CustomButton
          onClick={() => onUpdateStatus(doc.id, "APROVADO")}
          disabled={!!actionLoadingId}
          color="bg-green-100"
          textColor="text-green-800"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
        </CustomButton>
        <CustomButton
          onClick={() => onUpdateStatus(doc.id, "REPROVADO")}
          disabled={!!actionLoadingId}
          color="bg-red-100"
          textColor="text-red-800"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <X size={16} />}
        </CustomButton>
      </div>
    </li>
  );
}

// --- Componente Principal da Página ---
export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [contractTenantId, setContractTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { sub } = useCurrentUser();

  const contractId = params.contractId as string;

  const fetchData = useCallback(async () => {
    if (!contractId) return;
    try {
      const [docResponse, contractResponse] = await Promise.all([
        DocumentService.findByContract(contractId),
        ContractService.findOne(contractId),
      ]);
      setDocuments(docResponse.data);
      setContractTenantId(contractResponse.data.tenantId);
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Erro ao carregar documentos", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (
    docId: string,
    status: "APROVADO" | "REPROVADO"
  ) => {
    setActionLoading(docId);
    try {
      await DocumentService.updateStatus(docId, { status });
      toast.success(
        `Documento ${status === "APROVADO" ? "aprovado" : "reprovado"}!`
      );
      await fetchData();
    } catch (_error) {
      toast.error("Falha ao atualizar status", {
        description: extractAxiosError(_error),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const isTenant = sub === contractTenantId;
  const docsAwaitingReview = documents.filter(
    (d) => d.status === "AGUARDANDO_APROVACAO"
  );
  const docsApproved = documents.filter((d) => d.status === "APROVADO");
  const docsRejected = documents.filter((d) => d.status === "REPROVADO");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-24 md:pt-28 pb-10">
      <div className="max-w-3xl mx-auto px-4">
        <CustomButton onClick={() => router.back()} ghost className="mb-4">
          <ArrowLeft className="mr-2" /> Voltar ao Contrato
        </CustomButton>

        <header className="bg-card p-6 rounded-t-xl border-x border-t border-border">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg text-primary">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-800">
                {isTenant ? "Envio de Documentos" : "Verificação de Documentos"}
              </h1>
              <p className="text-zinc-500">
                {isTenant
                  ? "Envie os arquivos necessários para a análise do locador."
                  : "Analise e aprove ou reprove os documentos do inquilino."}
              </p>
            </div>
          </div>
        </header>

        <main className="bg-card p-6 rounded-b-xl border border-border">
          {isTenant ? (
            <ul className="space-y-3">
              {requiredDocs.map((docType) => (
                <DocumentUploadRow
                  key={docType}
                  docType={docType}
                  uploadedDoc={documents.find((d) => d.type === docType)}
                  contractId={contractId}
                  onUploadSuccess={fetchData}
                />
              ))}
            </ul>
          ) : (
            <div className="space-y-6">
              {docsAwaitingReview.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-zinc-800 mb-3 border-b border-border  pb-2">
                    Aguardando Análise ({docsAwaitingReview.length})
                  </h2>
                  <ul className="space-y-3">
                    {docsAwaitingReview.map((doc) => (
                      <DocumentReviewRow
                        key={doc.id}
                        doc={doc}
                        onUpdateStatus={handleUpdateStatus}
                        actionLoadingId={actionLoading}
                      />
                    ))}
                  </ul>
                </section>
              )}
              {docsApproved.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-zinc-800 mb-3 border-b border-border pb-2">
                    Aprovados ({docsApproved.length})
                  </h2>
                  <ul className="space-y-3">
                    {docsApproved.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-green-50/50 border border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="text-green-500" />
                          <span className="font-semibold text-zinc-800">
                            {documentTypeConfig[doc.type]?.label}
                          </span>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CustomButton ghost>
                            <Eye size={16} />
                          </CustomButton>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {docsRejected.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-zinc-800 mb-3 border-b border-border pb-2">
                    Reprovados ({docsRejected.length})
                  </h2>
                  <ul className="space-y-3">
                    {docsRejected.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-red-50/50 border border-red-200"
                      >
                        <div className="flex items-center gap-3">
                          <XCircle className="text-red-500" />
                          <span className="font-semibold text-zinc-800">
                            {documentTypeConfig[doc.type]?.label}
                          </span>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <CustomButton ghost>
                            <Eye size={16} />
                          </CustomButton>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {documents.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <FileClock size={40} className="mx-auto mb-2" />
                  Nenhum documento foi enviado ainda.
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
