"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Loader2,
  ShieldCheck,
  FileWarning,
  BellRing,
  Shredder,
  ExternalLink,
  HandCoins,
  FileEdit,
  MessageSquareWarning,
} from "lucide-react";
import { toast } from "sonner";
import { IoDocumentsOutline } from "react-icons/io5";
import { type ContractWithDocuments } from "@/interfaces/contract";
import { ContractService } from "@/services/domains/contractService";

import { CustomButton } from "@/components/forms/CustomButton";

import { DeleteContractModal } from "@/components/modals/contractModals/DeleteContractModal";
import { contractStatus } from "@/constants/contractStatus";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { PaymentStatus, Roles } from "@/constants";
import { ForceActivateContractModal } from "@/components/modals/contractModals/ForceActivateContractModal";
import { FaRegEye } from "react-icons/fa";
import { ContractFlowDetails } from "@/components/cards/details/ContractFlowDetails";
import { ContractDetails } from "@/components/cards/details/ContractDetails";
import { ContractPartiesDetails } from "@/components/cards/details/ContractPartiesDetails";
import { ResendNotificationModal } from "@/components/modals/contractModals/ResendNotificationModal";
import { CancelContractModal } from "@/components/modals/contractModals/CancelContractModal";

import { extractAxiosError } from "@/services/api";
import { LottieAnimation } from "@/components/common/LottieAnimation";
import signatureAnimation from "../../../../../../public/lottie/signature-animation.json";
import { JudicialReportCard } from "@/components/cards/JudicialReportCard";
import { ContractPaymentList } from "@/components/lists/ContractPaymentList";
import Link from "next/link";
import { PaymentService } from "@/services/domains/paymentService";
import { RegisterCaucaoModal } from "@/components/modals/contractModals/RegisterCaucaoModal";

export default function ContractManagementPage() {
  const [contract, setContract] = useState<ContractWithDocuments | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showResendModal, setShowResendModal] = useState(false);
  const [showRegisterCaucaoModal, setShowRegisterCaucaoModal] = useState(false);

  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;
  const { role, sub } = useCurrentUser();
  const [showActivateModal, setShowActivateModal] = useState(false);

  const fetchContract = useCallback(async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      const response = await ContractService.findOne(contractId);
      console.log("AQUI ESTA SEU RESPONSE", response);
      setContract(response.data);
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Contrato não encontrado ou acesso negado", {
        description: errorMessage,
      });
      router.push("/contratos");
    } finally {
      setLoading(false);
    }
  }, [contractId, router]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  const coverPhoto = useMemo(() => {
    if (!contract?.property?.photos || contract.property.photos.length === 0) {
      return null;
    }
    return (
      contract.property.photos.find((p) => p.isCover) ||
      contract.property.photos[0]
    );
  }, [contract?.property?.photos]);

  const handleActivate = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      await ContractService.activate(contract.id);
      toast.success("Contrato ativado com sucesso! Pagamentos gerados.");
      setShowActivateModal(false);
      await fetchContract();
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possível ativar o contrato", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleViewContract = async () => {
    if (!contract) return;

    const newTab = window.open("/loading-pdf.html", "_blank");

    if (!newTab) {
      toast.error(
        "Não foi possível abrir uma nova aba. Verifique se seu navegador está bloqueando pop-ups."
      );
      return;
    }

    setIsActionLoading(true);
    try {
      const response = await ContractService.getViewPdfUrl(contract.id);

      newTab.location.href = response.data.url;
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Falha ao obter URL do contrato", {
        description: errorMessage,
      });

      newTab.close();
    } finally {
      setIsActionLoading(false);
    }
  };
  const handleRequestSignature = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      await ContractService.requestSignature(contract.id);
      toast.success("Solicitação de assinatura enviada!", {
        description:
          "O locador e o locatário receberão um e-mail da Clicksign para assinar o documento.",
      });
      // A implementar: recarregar os dados ou atualizar o estado para esconder o botão.
      await fetchContract();
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possível iniciar o processo de assinatura", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResendNotification = async (
    signerId: string
    // method: "email" | "whatsapp"
  ) => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      await ContractService.resendNotification(contract.id, {
        signerId,
        // method,
      });
      toast.success("Notificação reenviada com sucesso!", {
        // description: `Um lembrete foi enviado por ${method} para o signatário selecionado.`,
        description: `Um lembrete foi enviado para o signatário selecionado.`,
      });
      setShowResendModal(false);
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possível enviar a notificação", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      await ContractService.cancel(contract.id);
      toast.success("Contrato cancelado com sucesso.");
      setShowCancelModal(false);
      await fetchContract();
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possível cancelar o contrato", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      await ContractService.remove(contract.id);
      toast.success("Contrato removido com sucesso.");
      router.push("/contratos");
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Erro ao remover contrato", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
      setShowDeleteModal(false);
    }
  };
  const handleRegisterCaucao = async () => {
    if (!contract) return;
    const caucaoPayment = contract.paymentsOrders?.find(
      (p) => p.status === "PENDENTE"
    );
    if (!caucaoPayment) {
      toast.error("Fatura da caução não encontrada.");
      return;
    }

    setIsActionLoading(true);
    try {
      await PaymentService.confirmSecurityCashPayment(caucaoPayment.id, {});
      toast.success("Recebimento da caução registrado com sucesso!");
      setShowRegisterCaucaoModal(false);
      await fetchContract();
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possível registrar o recebimento", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!contract) return null;

  const statusInfo = contractStatus.find((s) => s.value === contract.status);

  const ActionCard = () => {
    switch (contract.status) {
      case "EM_ELABORACAO":
        if (role === Roles.LOCADOR) {
          return (
            <div className="bg-card border-border border p-4 rounded-xl text-center">
              <FileEdit className="mx-auto text-gray-500" size={32} />
              <h3 className="font-bold text-lg mt-2">Elaboração do Contrato</h3>
              <p className="text-sm text-gray-600 mt-1">
                O contrato foi criado. O próximo passo é editar o conteúdo e
                enviá-lo para o inquilino revisar e aceitar.
              </p>
              <CustomButton
                onClick={() => router.push(`/contratos/${contract.id}/editor`)}
                className="mt-4 w-full"
              >
                Ir para o Editor de Contrato
              </CustomButton>
            </div>
          );
        }
        return (
          <div className="bg-gray-50 border-gray-200 border p-4 rounded-xl text-center">
            <Loader2 className="mx-auto text-gray-500 animate-spin" size={32} />
            <h3 className="font-bold text-lg mt-2">Contrato em Elaboração</h3>
            <p className="text-sm text-gray-600 mt-1">
              O locador está preparando os termos do contrato. Você será
              notificado quando estiver pronto para sua revisão.
            </p>
          </div>
        );

      case "AGUARDANDO_ACEITE_INQUILINO":
        if (role === Roles.LOCATARIO) {
          return (
            <div className="bg-cyan-50 border-cyan-200 border p-4 rounded-xl text-center">
              <FileText className="mx-auto text-cyan-600" size={32} />
              <h3 className="font-bold text-lg mt-2">Revise o Contrato</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                O contrato está pronto para sua revisão. Clique abaixo para ler
                os termos, aceitar ou solicitar alterações.
              </p>
              <CustomButton
                onClick={() => router.push(`/contratos/${contract.id}/revisar`)}
                className="mt-2 w-full"
                color="bg-cyan-600"
                textColor="text-white"
              >
                Revisar Contrato
              </CustomButton>
            </div>
          );
        }
        return (
          <div className="bg-cyan-50 border-cyan-200 border p-4 rounded-xl text-center">
            <Loader2 className="mx-auto text-cyan-500 animate-spin" size={32} />
            <h3 className="font-bold text-lg mt-2">Aguardando Inquilino</h3>
            <p className="text-sm text-gray-600 mt-1">
              O contrato foi enviado para o inquilino. Aguardando a revisão e o
              aceite dos termos para prosseguir.
            </p>
          </div>
        );
      case "SOLICITANDO_ALTERACAO":
        if (role === Roles.LOCADOR || role === Roles.ADMIN) {
          return (
            <div className="bg-purple-50 border-purple-200 border p-4 rounded-xl text-center flex flex-col justify-center items-center">
              <MessageSquareWarning
                className="mx-auto text-purple-600 mb-2"
                size={32}
              />
              <h3 className="font-bold text-lg mt-1 text-gray-800">
                {" "}
                Alteração Contratual Solicitada
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                O inquilino solicitou alterações no contrato. Revise o motivo,
                altere o contrato se necessário e envie novamente. O inquilino
                precisa aceitar para prosseguir.
              </p>

              {contract.alterationRequestReason && (
                <div className="mt-3 mb-4 text-left w-full max-w-md mx-auto bg-purple-100 p-3 rounded border border-purple-200">
                  <p className="text-xs font-semibold text-purple-800 mb-1">
                    Motivo da Solicitação:
                  </p>
                  <p className="text-sm text-purple-900 italic">
                    &quot;{contract.alterationRequestReason}&quot;
                  </p>
                </div>
              )}

              <CustomButton
                onClick={() => router.push(`/contratos/${contract.id}/editor`)}
                className="mt-2 w-full max-w-xs"
                color="bg-purple-600 hover:bg-purple-700"
                textColor="text-white"
              >
                Editar Contrato
              </CustomButton>
            </div>
          );
        }

        return (
          <div className="bg-purple-50 border-purple-200 border p-4 rounded-xl text-center">
            <Loader2
              className="mx-auto text-purple-500 animate-spin"
              size={32}
            />
            <h3 className="font-bold text-lg mt-2">
              Aguardando Revisão do Locador
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Sua solicitação de alteração foi enviada. O locador irá analisar e
              poderá ajustar o contrato. Você será notificado.
            </p>

            {contract.alterationRequestReason && (
              <div className="mt-3 text-left w-full max-w-md mx-auto bg-purple-100 p-3 rounded border border-purple-200">
                <p className="text-xs font-semibold text-purple-800 mb-1">
                  Sua Solicitação:
                </p>
                <p className="text-sm text-purple-900 italic">
                  &quot;{contract.alterationRequestReason}&quot;
                </p>
              </div>
            )}
          </div>
        );
      case "PENDENTE_DOCUMENTACAO":
        if (role === Roles.LOCATARIO) {
          return (
            <div className="bg-orange-50 border-orange-200 border p-4 rounded-xl text-center">
              <IoDocumentsOutline
                className="mx-auto text-orange-500"
                size={32}
              />
              <h3 className="font-bold text-lg mt-2">Envie Seus Documentos</h3>
              <p className="text-sm text-gray-600 mt-1">
                Obrigado por aceitar os termos! Agora, envie seus documentos
                para a análise do locador.
              </p>
              <CustomButton
                onClick={() =>
                  router.push(`/contratos/${contract.id}/documentos`)
                }
                className="mt-4 w-full"
              >
                Enviar Documentos
              </CustomButton>
            </div>
          );
        }
        return (
          <div className="bg-orange-50 border-orange-200 border p-4 rounded-xl text-center">
            <Loader2
              className="mx-auto text-orange-500 animate-spin"
              size={32}
            />
            <h3 className="font-bold text-lg mt-2">
              Aguardando Documentos do Inquilino
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              O inquilino aceitou os termos e agora está na etapa de envio de
              documentos para sua análise.
            </p>
          </div>
        );
      case "EM_ANALISE":
        if (role === "LOCADOR") {
          return (
            <div className="bg-yellow-50 border-yellow-200 border p-4 rounded-xl  text-center">
              <FileWarning className="mx-auto text-yellow-500" size={32} />
              <h3 className="font-bold text-lg mt-2">Documentos em Análise</h3>
              <p className="text-sm text-gray-600 mt-1">
                O inquilino enviou os documentos. Agora você precisa analisá-los
                e aprová-los.
              </p>
              <CustomButton
                onClick={() =>
                  router.push(`/contratos/${contract.id}/documentos`)
                }
                className="mt-4 w-full"
              >
                Verificar Documentos
              </CustomButton>
            </div>
          );
        }

        if (role === "LOCATARIO") {
          const hasRejected = contract.documents.some(
            (doc) => doc.status === "REPROVADO"
          );

          if (hasRejected) {
            return (
              <div className="bg-red-50 border-red-200 border p-4 rounded-xl  text-center">
                <FileWarning className="mx-auto text-red-500" size={32} />
                <h3 className="font-bold text-lg mt-2">
                  Pendências na Documentação
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Um ou mais documentos foram reprovados. Por favor, verifique e
                  envie-os novamente.
                </p>
                <CustomButton
                  onClick={() =>
                    router.push(`/contratos/${contract.id}/documentos`)
                  }
                  color="bg-red-600"
                  textColor="text-white"
                  className="w-full mt-4"
                >
                  Ver e Substituir Documentos
                </CustomButton>
              </div>
            );
          }

          return (
            <div className="bg-blue-50 border-blue-200 border p-4 rounded-xl  text-center">
              <Loader2
                className="mx-auto text-blue-500 animate-spin"
                size={32}
              />
              <h3 className="font-bold text-lg mt-2">Análise em Andamento</h3>
              <p className="text-sm text-gray-600 mt-1">
                Seus documentos estão sendo analisados pelo locador.
              </p>
            </div>
          );
        }
        return null;
      case "AGUARDANDO_ASSINATURAS":
        if (role === Roles.LOCADOR || role === Roles.ADMIN) {
          // A lógica para verificar se o processo começou permanece
          const signatureProcessStarted =
            contract.signatureRequests && contract.signatureRequests.length > 0;

          return (
            <div className="bg-indigo-50 border-indigo-200 border p-4 rounded-xl text-center">
              {isActionLoading ? (
                <Loader2 className="inline animate-spin w-4 h-4 mr-1" />
              ) : (
                <LottieAnimation
                  animationData={signatureAnimation}
                  className="w-20 h-20 mx-auto"
                />
              )}
              <h3 className="font-bold text-lg mt-2">
                {signatureProcessStarted
                  ? "Assinaturas Solicitadas"
                  : "Preparando para Assinatura"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                O processo de assinatura foi iniciado automaticamente. Locador e
                locatário receberão notificações para assinar o contrato.{" "}
                {!signatureProcessStarted && (
                  <button
                    onClick={handleRequestSignature}
                    disabled={isActionLoading}
                    className="text-primary hover:text-primary-hover underline font-semibold focus:outline-none"
                  >
                    Clique aqui se não tiver iniciado.
                  </button>
                )}
              </p>

              {/* {signatureProcessStarted && (
                <CustomButton
                  onClick={() => setShowResendModal(true)}
                  disabled={isActionLoading}
                  color="bg-sky-100"
                  textColor="text-sky-900"
                  className="w-full sm:w-auto mt-4"
                >
                  <BellRing className="mr-2" size={16} />
                  Reenviar Lembrete
                </CustomButton>
              )} */}
            </div>
          );
        }

        return (
          <div className="bg-indigo-50 border-indigo-200 border p-4 rounded-xl text-center">
            <LottieAnimation
              animationData={signatureAnimation}
              className="w-20 h-20 mx-auto"
            />
            <h3 className="font-bold text-lg -mt-2">Aguardando Assinaturas</h3>
            <p className="text-sm text-gray-600 mt-1">
              O contrato foi enviado para assinatura digital. Por favor,
              verifique o seu e-mail e WhatsApp para assinar o documento.
            </p>
          </div>
        );
      case "AGUARDANDO_GARANTIA":
        // Lógica para o Locador
        if (role === "LOCADOR" || role === Roles.ADMIN) {
          return (
            <div className="bg-indigo-50 border-indigo-200 border p-4 rounded-xl text-center">
              <HandCoins className="mx-auto text-indigo-500" size={32} />
              <h3 className="font-bold text-lg mt-2">
                Aguardando Pagamento da Caução
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                O contrato foi assinado. Agora, aguarde o inquilino realizar o
                pagamento da caução. Se o pagamento for feito em dinheiro,
                registre-o aqui.
              </p>
              <CustomButton
                onClick={() => setShowRegisterCaucaoModal(true)}
                disabled={isActionLoading}
                color="bg-indigo-500"
                className="mt-4 w-full"
              >
                Registrar recebimento
              </CustomButton>
            </div>
          );
        }

        if (role === "LOCATARIO") {
          const caucaoPayment = contract.paymentsOrders?.find(
            (p) =>
              p.status === PaymentStatus.PENDENTE ||
              p.status === PaymentStatus.ATRASADO ||
              PaymentStatus.FALHOU
          );

          return (
            <div className="bg-indigo-50 border-indigo-200 border p-4 rounded-xl text-center">
              <HandCoins className="mx-auto text-indigo-500" size={32} />
              <h3 className="font-bold text-lg mt-2">
                Pagamento da Caução Pendente
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                O contrato foi assinado! Para ativá-lo, realize o pagamento da
                caução clicando no botão abaixo.
              </p>
              <CustomButton
                onClick={() => {
                  if (caucaoPayment) {
                    router.push(`/faturas/${caucaoPayment.id}`);
                  } else {
                    toast.error(
                      "Não foi possível encontrar a fatura da caução."
                    );
                  }
                }}
                disabled={!caucaoPayment}
                color="bg-indigo-500"
                textColor="text-white"
                className="w-full mt-4"
              >
                Realizar pagamento
              </CustomButton>
            </div>
          );
        }
        return null;
      case "PENDENTE_DOCUMENTACAO":
        if (role === "LOCATARIO" && sub === contract.tenantId) {
          return (
            <div className="bg-blue-50 border-blue-200 border p-4 rounded-xl  text-center">
              <FileText className="mx-auto text-blue-500" size={32} />
              <h3 className="font-bold text-lg mt-2">Documentação Pendente</h3>
              <p className="text-sm text-gray-600 mt-1">
                Você precisa enviar seus documentos para que o proprietário
                possa analisar.
              </p>
              <CustomButton
                onClick={() =>
                  router.push(`/contratos/${contract.id}/documentos`)
                }
                color="bg-blue-600"
                textColor="text-white"
                className="w-full mt-4"
              >
                Enviar Documentos
              </CustomButton>
            </div>
          );
        }

        return (
          <div className="bg-orange-50 border-orange-200 border p-4 rounded-xl text-center">
            <h3 className="font-bold text-lg">Aguardando Documentos</h3>
            <p className="text-sm text-gray-600 mt-1">
              O locatário precisa enviar a documentação (CPF, IDENTIDADE FRENTE
              e COMPROVANTE DE RENDA) para que você possa analisar, mas,
              enquanto isso, você pode verificar quais foram enviados.
            </p>
            <CustomButton
              onClick={() =>
                router.push(`/contratos/${contract.id}/documentos`)
              }
              color="bg-orange-600"
              textColor="text-white"
              className="w-full mt-4"
            >
              Verificar Documentos
            </CustomButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <header className="mb-6">
            <CustomButton
              onClick={() => router.push("/contratos")}
              ghost
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2" />
              Voltar para Contratos
            </CustomButton>
            <div className="mt-4 bg-card p-4 rounded-xl  border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                <div className="relative w-16 h-16 rounded-lg bg-zinc-100 shrink-0 overflow-hidden border border-border">
                  {coverPhoto ? (
                    <Image
                      src={coverPhoto.url!}
                      alt={`Foto de ${contract.property.title}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <FileText size={24} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Gerenciar Contrato
                  </h1>
                  <p className="text-gray-500 mt-1">
                    <Link
                      href={`/imovel/${contract.property.id}`}
                      className="hover:underline transition-colors hover:text-primary flex items-center "
                      target="_self"
                    >
                      Imóvel: {contract.property.title}
                      <ExternalLink className="inline ml-2 " size={16} />
                    </Link>
                  </p>
                </div>
              </div>
              {statusInfo && (
                <div
                  className={`px-4 py-2 text-sm font-bold rounded-full ${statusInfo.class}`}
                >
                  {statusInfo.label}
                </div>
              )}
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6 ">
              <ActionCard />
              <ContractFlowDetails contract={contract} />
              <ContractDetails contract={contract} />
              {contract.paymentsOrders &&
                contract.paymentsOrders.length > 0 && (
                  <ContractPaymentList
                    payments={contract.paymentsOrders}
                    onRefresh={() => fetchContract()}
                  />
                )}
              {contract.status === "ATIVO" &&
                (role === Roles.LOCADOR || role === Roles.ADMIN) && (
                  <JudicialReportCard
                    contract={contract}
                    onReportGenerated={fetchContract}
                  />
                )}
            </div>

            <aside className="lg:col-span-1 space-y-6">
              <ContractPartiesDetails contract={contract} />

              <div className="bg-card p-4 rounded-xl  border border-border space-y-3">
                <h3 className="font-bold text-lg">Outras Ações</h3>
                {(contract.status === "AGUARDANDO_ASSINATURAS" ||
                  contract.status === "ATIVO" ||
                  contract.status === "CANCELADO" ||
                  contract.status === "FINALIZADO") && (
                  <CustomButton
                    onClick={handleViewContract}
                    disabled={isActionLoading}
                    color="bg-green-100"
                    textColor="text-green-900"
                    className="w-full"
                  >
                    {isActionLoading ? (
                      <Loader2 className="animate-spin mr-2" />
                    ) : (
                      <>
                        <FaRegEye className="mr-2" /> Visualizar Contrato
                      </>
                    )}
                  </CustomButton>
                )}
                {(contract.status === "PENDENTE_DOCUMENTACAO" ||
                  contract.status === "EM_ANALISE" ||
                  contract.status === "AGUARDANDO_ASSINATURAS" ||
                  contract.status === "ATIVO" ||
                  contract.status === "CANCELADO" ||
                  contract.status === "FINALIZADO") && (
                  <CustomButton
                    onClick={() => {
                      router.push(`/contratos/${contract.id}/documentos`);
                    }}
                    disabled={isActionLoading}
                    color="bg-indigo-100"
                    textColor="text-indigo-900"
                    className="w-full"
                  >
                    {isActionLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <IoDocumentsOutline className="mr-2" />
                        Visualizar Documentos
                      </>
                    )}
                  </CustomButton>
                )}
                {contract.status === "AGUARDANDO_ASSINATURAS" &&
                  (sub === contract.landlordId || role === Roles.ADMIN) && (
                    <CustomButton
                      onClick={() => setShowResendModal(true)}
                      disabled={isActionLoading}
                      color="bg-sky-100"
                      textColor="text-sky-900"
                      className="w-full"
                    >
                      <BellRing className="mr-2" size={20} />
                      Enviar Lembrete de Assinatura
                    </CustomButton>
                  )}
                {(sub === contract.landlordId || role === Roles.ADMIN) && (
                  <>
                    {(contract.status === "PENDENTE_DOCUMENTACAO" ||
                      contract.status === "EM_ANALISE" ||
                      contract.status === "AGUARDANDO_ACEITE_INQUILINO" ||
                      contract.status === "SOLICITANDO_ALTERACAO" ||
                      contract.status === "AGUARDANDO_ASSINATURAS") && (
                      <CustomButton
                        onClick={() => setShowActivateModal(true)}
                        disabled={isActionLoading}
                        color="bg-amber-200"
                        textColor="text-amber-900"
                        className="w-full"
                      >
                        {isActionLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck className="mr-2" size={20} />
                            Forçar Ativação do Contrato
                          </>
                        )}
                      </CustomButton>
                    )}
                    {contract.status !== "CANCELADO" &&
                      contract.status !== "FINALIZADO" && (
                        <CustomButton
                          onClick={() => setShowCancelModal(true)}
                          disabled={isActionLoading}
                          color="bg-red-100"
                          textColor="text-red-900"
                          className="w-full"
                        >
                          <Shredder className="mr-2" size={20} />
                          Cancelar Contrato
                        </CustomButton>
                      )}
                    {(contract.status === "CANCELADO" ||
                      contract.status === "FINALIZADO") && (
                      <CustomButton
                        onClick={() => setShowDeleteModal(true)}
                        disabled={isActionLoading}
                        color="bg-red-100"
                        textColor="text-red-900"
                        className="w-full"
                      >
                        {/* <Trash2 className="mr-2" size={20} /> */}
                        <Shredder className="mr-2" size={20} />
                        Remover Contrato
                      </CustomButton>
                    )}
                  </>
                )}
              </div>
            </aside>
          </main>
        </div>
      </div>
      <CancelContractModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
        isLoading={isActionLoading}
      />
      <DeleteContractModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isActionLoading}
      />

      <ForceActivateContractModal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        onConfirm={handleActivate}
        isLoading={isActionLoading}
      />
      {contract && (
        <ResendNotificationModal
          isOpen={showResendModal}
          onClose={() => setShowResendModal(false)}
          onConfirm={handleResendNotification}
          isLoading={isActionLoading}
          contract={contract}
        />
      )}
      <RegisterCaucaoModal
        isOpen={showRegisterCaucaoModal}
        onClose={() => setShowRegisterCaucaoModal(false)}
        onConfirm={handleRegisterCaucao}
        isLoading={isActionLoading}
      />
    </>
  );
}
