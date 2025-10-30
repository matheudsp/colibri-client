"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PdfService } from "@/services/domains/pdfService";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import { CustomButton } from "@/components/forms/CustomButton";
import { VariablesContextProvider } from "@/components/editor/context/VariablesProvider";
import {
  exportHtmlFile,
  preprocessContent,
  convertDataToOptions,
  serializeContentForBackend,
} from "@/components/editor/utils/serializer";
import { VariablesExtension } from "@/components/editor/extensions/variableExtension";
import {
  customFindSuggestionMatch,
  suggestionRenderer,
} from "@/components/editor/utils/suggestion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toolbar } from "@/components/editor/components/Toolbar";
import { ContractService } from "@/services/domains/contractService";
import { toast } from "sonner";
import { extractAxiosError } from "@/services/api";
import {
  ArrowLeft,
  CalendarDays,
  Edit2Icon,
  EllipsisVertical,
  FileDown,
  HelpCircle,
  RefreshCcw,
  Send,
  Shield,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatGuaranteeType } from "@/utils/formatters";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants";
/**
 * Componente de Skeleton para o editor, para evitar CLS (Cumulative Layout Shift)
 */
function EditorSkeleton() {
  return (
    <div className="w-full bg-card  rounded-lg shadow-lg border border-border  p-6 min-h-[500px]">
      <div className="animate-pulse flex flex-col space-y-4">
        <div className="h-4 bg-muted  rounded w-3/4"></div>
        <div className="h-4 bg-muted  rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    </div>
  );
}

export default function EditContractPage() {
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;
  const [parseVariables, setParseVariables] = useState(false);
  const { role, loading: roleLoading } = useCurrentUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!roleLoading) {
      if (role !== Roles.LOCADOR && role !== Roles.ADMIN) {
        toast.error("Acesso Negado", {
          description: "Você não tem permissão para editar este contrato.",
        });
        router.replace(`/contratos/${contractId}`);
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [role, roleLoading, router, contractId]);

  const {
    data: contractResponse,
    isLoading: isLoadingContract,
    error: contractError,
  } = useQuery({
    queryKey: ["contractDetails", contractId],
    queryFn: () => ContractService.findOne(contractId),
    enabled: !!contractId && isAuthorized === true,
    retry: false, // Evita retentativas em erros (ex: 404)
  });
  const contract = contractResponse?.data;

  const {
    data: templateResponse,
    isLoading: isLoadingTemplate,
    error: templateError,
  } = useQuery({
    queryKey: ["contractTemplate", contractId],
    queryFn: () => PdfService.getContractTemplate(contractId),

    enabled:
      !!contract &&
      isAuthorized === true &&
      (contract.status === "EM_ELABORACAO" ||
        contract.status === "SOLICITANDO_ALTERACAO"),
    retry: false,
  });
  const templateHtml = templateResponse?.data?.templateHtml;
  const templateData = templateResponse?.data?.templateData;

  useEffect(() => {
    if (isAuthorized === false) return;

    if (contractError) {
      toast.error("Falha ao carregar os dados para edição.", {
        description: extractAxiosError(contractError),
      });
      router.push("/contratos");
      return;
    }

    if (
      contract &&
      contract.status !== "EM_ELABORACAO" &&
      contract.status !== "SOLICITANDO_ALTERACAO"
    ) {
      toast.warning("Este contrato não está mais na fase de edição.");
      router.push(`/contratos/${contractId}`);
      return;
    }

    if (templateError) {
      toast.error("Falha ao carregar o template do contrato.", {
        description: extractAxiosError(templateError),
      });
    }
  }, [
    contract,
    contractError,
    templateError,
    contractId,
    router,
    isAuthorized,
  ]);

  const processedContent = useMemo(
    () => preprocessContent(templateHtml),
    [templateHtml]
  );

  const variableOptions = useMemo(
    () => convertDataToOptions(templateData),
    [templateData]
  );

  const editor = useEditor(
    {
      immediatelyRender: false,
      editable: !parseVariables && isAuthorized === true,
      extensions: [
        StarterKit,
        Underline,
        VariablesExtension.configure({
          suggestion: {
            char: "{{",
            findSuggestionMatch: customFindSuggestionMatch,
            ...suggestionRenderer,
          },
        }),
      ],
      content:
        !isLoadingContract && isAuthorized === true ? processedContent : "",

      editorProps: {
        attributes: {
          class:
            "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-none p-6 focus:outline-none min-h-[500px]",
        },
      },
    },
    [processedContent, isAuthorized, isLoadingContract, contract?.status]
  );
  useEffect(() => {
    if (editor) {
      editor.setEditable(!parseVariables && isAuthorized === true);
    }
  }, [editor, parseVariables, isAuthorized]);
  const handleSaveContract = async () => {
    if (!contractId || !editor || isAuthorized !== true) return;

    const rawHtmlFromEditor = editor.getHTML();
    const htmlToSend = serializeContentForBackend(rawHtmlFromEditor);
    const promise = () =>
      ContractService.updateContractHtml(contractId, {
        contractHtml: htmlToSend,
      });

    toast.promise(promise(), {
      loading: "Finalizando e Enviando para Aceite...",
      success: () => {
        router.push(`/contratos/${contractId}`);
        return "Contrato enviado com sucesso! O inquilino foi notificado.";
      },
      error: (err) =>
        `Não foi possível salvar o contrato: ${extractAxiosError(err)}`,
    });
  };

  const handleResetContract = () => {
    if (editor && processedContent && isAuthorized === true) {
      editor.commands.setContent(processedContent);
      toast.info("O conteúdo do contrato foi resetado para o original.");
    }
  };

  const isLoading =
    roleLoading ||
    isAuthorized === null ||
    isLoadingContract ||
    (isAuthorized === true &&
      (contract?.status === "EM_ELABORACAO" ||
        contract?.status === "SOLICITANDO_ALTERACAO") &&
      isLoadingTemplate);

  if (isLoading || !editor) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="max-w-4xl w-full">
          <EditorSkeleton />
        </div>
      </div>
    );
  }
  if (isAuthorized !== true) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background ">
      <VariablesContextProvider
        parseVariables={parseVariables}
        variableOptions={variableOptions}
        values={templateData}
      >
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className=" flex-shrink-0 mb-4">
            <CustomButton
              ghost
              onClick={() => router.push(`/contratos/${contractId}`)}
              icon={<ArrowLeft size={14} />}
            >
              Voltar
            </CustomButton>
          </div>

          <header className="bg-card border-x border-t border-border px-5 py-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2">
                  <Edit2Icon size={18} className="text-muted-foreground" />
                  <h1 className="text-lg font-medium truncate">
                    Contrato do Imóvel: {contract?.property.title}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground border rounded-lg p-2">
                  <div className="flex items-center gap-1.5" title="Locador">
                    <User size={14} />
                    <span>{contract?.landlord.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5" title="Inquilino">
                    <User size={14} />
                    <span>{contract?.tenant.name}</span>
                  </div>

                  <div
                    className="flex items-center gap-1.5"
                    title="Vigência do Contrato"
                  >
                    <CalendarDays size={14} />
                    <span>
                      {formatDate(contract?.startDate)} à{" "}
                      {formatDate(contract?.endDate)}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-1.5"
                    title="Tipo de Garantia"
                  >
                    <Shield size={14} />
                    <span>{formatGuaranteeType(contract?.guaranteeType)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                <CustomButton
                  onClick={handleSaveContract}
                  icon={<Send size={14} />}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm w-full sm:w-auto"
                >
                  Finalizar e Enviar
                </CustomButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <CustomButton
                      ghost
                      icon={<EllipsisVertical size={16} />}
                      className="w-auto"
                    ></CustomButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => exportHtmlFile(editor as Editor)}
                    >
                      <FileDown size={14} className="mr-2" />
                      Exportar para HTML
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleResetContract}
                      className="cursor-pointer"
                    >
                      <RefreshCcw size={14} className="mr-2" />
                      Resetar Contrato
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:flex-row items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground  max-w-[100%]">
                Revise o texto e use{" "}
                <code className="px-1 rounded bg-muted font-mono text-xs">
                  {"{{"}
                </code>{" "}
                para inserir dados do contrato.
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <CustomButton
                    ghost
                    icon={<HelpCircle size={14} />}
                    className="text-xs h-auto px-2 py-1"
                  >
                    Como funciona?
                  </CustomButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Como Usar o Editor de Contrato</DialogTitle>
                    <DialogDescription>
                      Um guia rápido para editar e finalizar seu contrato.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 text-sm text-muted-foreground py-4">
                    <p>
                      Este editor permite que você revise e ajuste o contrato
                      antes de enviá-lo para assinatura.
                    </p>

                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        1. Formatação de Texto
                      </h4>
                      <p>
                        Use a barra de ferramentas acima do editor para formatar
                        o texto, aplicando
                        <strong> Negrito</strong>, <em> Itálico</em>,
                        <u> Sublinhado</u> e outras opções.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        2. Variáveis Dinâmicas (Mágicas)
                      </h4>
                      <p>
                        As &apos;variáveis&apos; (ex:
                        <code className="px-1 rounded bg-muted font-mono text-xs">
                          {`{{tenant.name}}`}
                        </code>
                        ) são campos especiais que puxam dados do contrato
                        automaticamente.
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
                        <li>
                          <strong>Para Adicionar:</strong> Digite
                          <code className="px-1 rounded bg-muted font-mono text-xs">
                            {"{{"}
                          </code>
                          (duas chaves) para abrir a lista de variáveis. Comece
                          a digitar para filtrar e selecione a desejada.
                        </li>
                        <li>
                          <strong>Para Visualizar:</strong> Use o botão de
                          <strong> `&quot;Pré-visualizar`&quot;</strong> (ícone
                          de olho) na barra de ferramentas para alternar entre o
                          variáveis (<code>{`{{...}}`}</code>) e o valor real
                          (ex: `&quot;Matheus Pereira`&quot;).
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        3. Ações Principais
                      </h4>
                      <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>
                          <strong>Finalizar e Enviar:</strong> Salva o contrato
                          e o envia para assinatura do inquilino.
                        </li>
                        <li>
                          <strong>Resetar Contrato:</strong> (No menu
                          &apos;...&apos;) Restaura o contrato ao seu modelo
                          original, desfazendo todas as suas alterações.
                        </li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <Toolbar
            editor={editor}
            parseVariables={parseVariables}
            onToggleParseVariables={() => setParseVariables(!parseVariables)}
          />
          <div className="bg-card border-x border-b border-border shadow overflow-hidden">
            <EditorContent editor={editor} />
          </div>
        </div>
      </VariablesContextProvider>
    </div>
  );
}
