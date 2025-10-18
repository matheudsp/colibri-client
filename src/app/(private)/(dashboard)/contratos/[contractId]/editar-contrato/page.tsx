"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Edit2Icon, Loader2, Send } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import { ContractService } from "@/services/domains/contractService";
import {
  PdfService,
  type ContractTemplateResponse,
} from "@/services/domains/pdfService";
import { extractAxiosError } from "@/services/api";

import { Toolbar } from "@/components/editor/Toolbar";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { CustomButton } from "@/components/forms/CustomButton";
import PageHeader from "@/components/common/PageHeader";
import type { ContractWithDocuments } from "@/interfaces/contract";
import { Link } from "@tiptap/extension-link";
const populateTemplate = (html: string, data: Record<string, any>): string => {
  if (!html) return "";

  // Este regex agora captura o conteúdo dentro de {{...}} de forma mais flexível
  return html.replace(/\{\{\s*(.*?)\s*\}\}/g, (match, capturedKey) => {
    // 1. LIMPEZA: Remove qualquer tag HTML de dentro do placeholder capturado.
    // Isso transforma algo como '<a href="...">tenant.name</a>' em apenas 'tenant.name'
    const key = capturedKey.replace(/<[^>]*>/g, "");

    // 2. BUSCA: Procede com a lógica de busca no objeto de dados aninhado
    const value = key.split(".").reduce((o, i) => (o ? o[i] : undefined), data);

    // 3. SUBSTITUIÇÃO: Retorna o valor encontrado ou o placeholder original se nada for encontrado.
    return value !== undefined && value !== null ? String(value) : match;
  });
};
export default function EditContractPage() {
  const [contract, setContract] = useState<ContractWithDocuments | null>(null);
  const [template, setTemplate] = useState<ContractTemplateResponse | null>(
    null
  );
  const [previewHtml, setPreviewHtml] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Underline,
      Link.configure({
        autolink: false,
        openOnClick: false,
        linkOnPaste: false,
      }),
    ],
    immediatelyRender: false,
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (template?.templateData) {
        setPreviewHtml(populateTemplate(html, template.templateData));
      }
    },
  });

  // Efeito para buscar os dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!contractId || !editor) return;
      setIsLoading(true);
      try {
        const contractRes = await ContractService.findOne(contractId);
        const currentContract = contractRes.data;
        setContract(currentContract);

        if (currentContract.status !== "EM_ELABORACAO") {
          toast.warning("Este contrato não está mais na fase de edição.");
          router.push(`/contratos/${contractId}`);
          return;
        }

        const templateRes = await PdfService.getContractTemplate(contractId);
        const loadedTemplate = templateRes.data;
        setTemplate(loadedTemplate);

        editor.commands.setContent(loadedTemplate.templateHtml);
        setPreviewHtml(
          populateTemplate(
            loadedTemplate.templateHtml,
            loadedTemplate.templateData
          )
        );
      } catch (error) {
        toast.error("Falha ao carregar os dados para edição.", {
          description: extractAxiosError(error),
        });
        router.push("/contratos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [contractId, router, editor]);

  const handleSaveContract = async () => {
    if (!contract || !editor) return;
    setIsSaving(true);
    try {
      const finalHtml = editor.getHTML();
      await ContractService.updateContractHtml(contract.id, {
        contractHtml: finalHtml,
      });
      toast.success("Contrato finalizado com sucesso!", {
        description:
          "O inquilino foi notificado para revisar e aceitar os termos.",
      });
      router.push(`/contratos/${contract.id}`);
    } catch (error) {
      toast.error("Não foi possível salvar o contrato.", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !editor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
        <span className="ml-4">Carregando editor de contrato...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col p-4 bg-gray-50">
      <header className="flex items-center justify-between pb-4 border-b border-border mb-4 shrink-0">
        <div className="flex-col w-full space-y-6">
          <div className="flex  justify-between w-full ">
            <CustomButton
              onClick={() => router.push(`/contratos/${contractId}`)}
              ghost
              className="text-sm"
              icon={<ArrowLeft size={16} />}
            >
              Voltar para o Contrato
            </CustomButton>
            <CustomButton
              onClick={handleSaveContract}
              disabled={isSaving || editor.getHTML().length < 100}
              icon={
                isSaving ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <Send className="mr-2" />
                )
              }
            >
              Finalizar e Enviar para Aceite
            </CustomButton>
          </div>
          <PageHeader
            className="mt-2"
            title="Editor de Contrato"
            icon={Edit2Icon}
            subtitle={`Imóvel: ${contract?.property?.title}`}
          />
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
        {/* Coluna do Editor */}
        <div className="flex flex-col h-full overflow-hidden">
          <Toolbar editor={editor} />
          <div className="mt-2 border border-border rounded-md flex-grow bg-white overflow-y-auto relative">
            <EditorContent editor={editor} className="p-4 prose max-w-none " />
          </div>
        </div>

        {/* Coluna da Sidebar */}
        <div className="flex flex-col h-full overflow-hidden">
          <EditorSidebar
            previewHtml={previewHtml}
            templateData={template?.templateData || {}}
          />
        </div>
      </main>
    </div>
  );
}
