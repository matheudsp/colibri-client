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
  CircleHelp,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Document, DocumentType } from "@/interfaces/document";
import { DocumentService } from "@/services/domains/documentService";
import { CustomButton } from "@/components/forms/CustomButton";
import { useAuth } from "@/hooks/useAuth";
import { ContractService } from "@/services/domains/contractService";
import { useUserRole } from "@/hooks/useUserRole";
import { extractAxiosError } from "@/services/api";

const documentTypeLabels: Record<DocumentType, string> = {
  IDENTIDADE_FRENTE: "Identidade (Frente)",
  IDENTIDADE_VERSO: "Identidade (Verso)",
  CPF: "CPF",
  COMPROVANTE_RENDA: "Comprovante de Renda",
  COMPROVANTE_ENDERECO: "Comprovante de Endereço",
};

const requiredDocs: DocumentType[] = [
  "IDENTIDADE_FRENTE",
  "IDENTIDADE_VERSO",
  "CPF",
  "COMPROVANTE_RENDA",
];

// Componente para a linha de um documento (para o inquilino)
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await DocumentService.uploadDocument(contractId, file, docType);
      toast.success(`"${documentTypeLabels[docType]}" enviado com sucesso!`);
      onUploadSuccess();
    } catch (error) {
      toast.error(`Erro ao enviar documento: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusChip = () => {
    if (!uploadedDoc)
      return (
        <span className="text-xs font-bold text-gray-500">NÃO ENVIADO</span>
      );
    switch (uploadedDoc.status) {
      case "APROVADO":
        return <CheckCircle2 className="text-green-500" />;
      case "REPROVADO":
        return <XCircle className="text-red-500" />;
      default:
        return <CircleHelp className="text-yellow-500" />;
    }
  };

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-gray-50 border">
      <div className="flex items-center gap-2">
        {getStatusChip()}
        <span className="font-semibold">{documentTypeLabels[docType]}</span>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,application/pdf"
      />
      <CustomButton
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="mt-3 sm:mt-0"
        ghost
      >
        {isUploading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <Upload size={16} className="mr-2" />
            {uploadedDoc ? "Substituir" : "Enviar"}
          </>
        )}
      </CustomButton>
    </li>
  );
}

export default function DocumentPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [contractTenantId, setContractTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { sub } = useUserRole();

  const contractId = params.contractId as string;

  useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [docResponse, contractResponse] = await Promise.all([
        DocumentService.findByContract(contractId),
        ContractService.findOne(contractId),
      ]);
      setDocuments(docResponse.data);
      setContractTenantId(contractResponse.data.tenantId);
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Erro ao carregar documentos", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [contractId]);

  useEffect(() => {
    if (contractId) {
      fetchData();
    }
  }, [contractId, fetchData]);

  const handleUpdateStatus = async (
    documentId: string,
    status: "APROVADO" | "REPROVADO"
  ) => {
    setActionLoading(documentId);
    try {
      await DocumentService.updateStatus(documentId, { status });
      toast.success(
        `Documento ${status === "APROVADO" ? "aprovado" : "reprovado"}!`
      );
      await fetchData();
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Falha ao atualizar o status do documento", {
        description: errorMessage,
      });
    } finally {
      setActionLoading(null);
    }
  };

  const isTenant = sub === contractTenantId;

  const renderContent = () => {
    if (isTenant) {
      // VISÃO DO INQUILINO (UPLOAD)
      return (
        <ul className="space-y-3">
          {requiredDocs.map((docType) => {
            const uploadedDoc = documents.find((d) => d.type === docType);
            return (
              <DocumentUploadRow
                key={docType}
                docType={docType}
                uploadedDoc={uploadedDoc}
                contractId={contractId}
                onUploadSuccess={fetchData}
              />
            );
          })}
        </ul>
      );
    }

    // VISÃO DO LOCADOR (VERIFICAÇÃO)
    if (documents.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum documento foi enviado ainda.</p>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-gray-50 border"
          >
            <div>
              <p className="font-semibold">{documentTypeLabels[doc.type]}</p>
              <p
                className={`text-sm font-bold ${
                  doc.status === "APROVADO"
                    ? "text-green-600"
                    : doc.status === "REPROVADO"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {doc.status.replace("_", " ")}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <CustomButton ghost>
                  <Eye size={16} className="mr-2" /> Visualizar
                </CustomButton>
              </a>
              {doc.status === "AGUARDANDO_APROVACAO" && (
                <>
                  <CustomButton
                    onClick={() => handleUpdateStatus(doc.id, "APROVADO")}
                    disabled={!!actionLoading}
                    color="bg-green-100"
                    textColor="text-green-800"
                  >
                    {actionLoading === doc.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                  </CustomButton>
                  <CustomButton
                    onClick={() => handleUpdateStatus(doc.id, "REPROVADO")}
                    disabled={!!actionLoading}
                    color="bg-red-100"
                    textColor="text-red-800"
                  >
                    {actionLoading === doc.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                  </CustomButton>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 md:pt-28 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        <CustomButton
          onClick={() => router.back()}
          ghost
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" />
          Voltar ao Contrato
        </CustomButton>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center gap-3 mb-4 border-b pb-4">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isTenant ? "Envio de Documentos" : "Verificação de Documentos"}
              </h1>
              <p className="text-gray-500">
                {isTenant
                  ? "Envie os documentos necessários para a análise."
                  : "Analise os documentos enviados pelo inquilino."}
              </p>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
