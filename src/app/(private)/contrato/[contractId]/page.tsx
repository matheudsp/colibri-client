"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Loader2,
  ShieldCheck,
  FileWarning,
  BellRing,
  MailCheck,
  Shredder,
} from "lucide-react";
import { toast } from "sonner";
import { type ContractWithDocuments } from "@/interfaces/contract";
import { ContractService } from "@/services/domains/contractService";

import { CustomButton } from "@/components/forms/CustomButton";

import { PaymentsList } from "@/components/lists/PaymentLists";
import { DeleteContractModal } from "@/components/modals/contractModals/DeleteContractModal";
import { contractStatus } from "@/constants/contractStatus";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants";
import { ForceActivateContractModal } from "@/components/modals/contractModals/ForceActivateContractModal";
import { FaRegEye } from "react-icons/fa";
import { ContractFlowDetails } from "@/components/cards/details/ContractFlowDetails";
import { ContractDetails } from "@/components/cards/details/ContractDetails";
import { ContractPartiesDetails } from "@/components/cards/details/ContractPartiesDetails";
import { ResendNotificationModal } from "@/components/modals/contractModals/ResendNotificationModal";
import { CancelContractModal } from "@/components/modals/contractModals/CancelContractModal";
import { PaymentService } from "@/services/domains/paymentService";
import { RegisterPaymentModal } from "@/components/modals/paymentModals/RegisterPaymentModal";
import { extractAxiosError } from "@/services/api";

export default function ContractManagementPage() {
  const [contract, setContract] = useState<ContractWithDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSigningLoading, setIsSigningLoading] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [showRegisterPaymentModal, setShowRegisterPaymentModal] =
    useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
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
  const handleOpenRegisterModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setShowRegisterPaymentModal(true);
  };

  const handleRegisterPayment = async () => {
    if (!selectedPaymentId) return;

    setIsActionLoading(true);
    try {
      await PaymentService.register(selectedPaymentId, {});
      toast.success("Pagamento registado com sucesso!");
      setShowRegisterPaymentModal(false);
      await fetchContract(); // Recarrega os dados do contrato para atualizar a lista
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possivel registrar pagamento", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
      setSelectedPaymentId(null);
    }
  };

  const handleViewContract = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      const response = await ContractService.getViewPdfUrl(contract.id);

      window.open(response.data.url, "_blank");
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Falha ao obter URL do contrato ", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
    }
  };
  const handleRequestSignature = async () => {
    if (!contract) return;
    setIsSigningLoading(true);
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
      setIsSigningLoading(false);
    }
  };
  const handleResendNotification = async (
    signerId: string,
    method: "email" | "whatsapp"
  ) => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      await ContractService.resendNotification(contract.id, {
        signerId,
        method,
      });
      toast.success("Notificação reenviada com sucesso!", {
        description: `Um lembrete foi enviado por ${method} para o signatário selecionado.`,
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
      case "EM_ANALISE":
        if (role === "LOCADOR") {
          return (
            <div className="bg-yellow-50 border-yellow-200 border p-4 rounded-xl shadow-sm text-center">
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
              <div className="bg-red-50 border-red-200 border p-4 rounded-xl shadow-sm text-center">
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
            <div className="bg-blue-50 border-blue-200 border p-4 rounded-xl shadow-sm text-center">
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
        const signatureProcessStarted = contract.GeneratedPdf?.some(
          (pdf) => pdf.signatureRequests.length > 0
        );

        if (role === Roles.LOCADOR || role === Roles.ADMIN) {
          if (signatureProcessStarted) {
            return (
              <div className="bg-green-50 border-green-200 border p-4 rounded-xl shadow-sm text-center">
                <MailCheck className="mx-auto text-green-500" size={32} />
                <h3 className="font-bold text-lg mt-2">
                  Assinaturas Solicitadas
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  O contrato foi enviado para ambos. Eles devem verificar os
                  seus e-mails e WhatsApp para assinar. Você pode reenviar as
                  notificações se necessário.
                </p>
              </div>
            );
          } else {
            return (
              <div className="bg-red-50 border-red-200 border p-4 rounded-xl shadow-sm text-center">
                <FileWarning className="mx-auto text-red-500" size={32} />
                <h3 className="font-bold text-lg mt-2">Ação Necessária</h3>
                <p className="text-sm text-gray-600 mt-1">
                  A documentação foi aprovada. Clique abaixo para gerar o
                  contrato e enviá-lo para a assinatura digital de ambas as
                  partes.
                </p>
                <CustomButton
                  onClick={handleRequestSignature}
                  disabled={isSigningLoading}
                  color="bg-indigo-600"
                  textColor="text-white"
                  className="w-full mt-4"
                >
                  {isSigningLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Iniciar Assinatura Digital"
                  )}
                </CustomButton>
              </div>
            );
          }
        }

        return (
          <div className="bg-indigo-50 border-indigo-200 border p-4 rounded-xl shadow-sm text-center">
            <Loader2
              className="mx-auto text-indigo-500 animate-spin"
              size={32}
            />
            <h3 className="font-bold text-lg mt-2">Aguardando Assinaturas</h3>
            <p className="text-sm text-gray-600 mt-1">
              O contrato foi enviado para assinatura digital. Por favor,
              verifique o seu e-mail e WhatsApp para assinar o documento.
            </p>
          </div>
        );

      case "PENDENTE_DOCUMENTACAO":
        if (role === "LOCATARIO" && sub === contract.tenantId) {
          return (
            <div className="bg-blue-50 border-blue-200 border p-4 rounded-xl shadow-sm text-center">
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
          <div className="bg-orange-50 border-orange-200 border p-4 rounded-xl shadow-sm text-center">
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
      <div className="bg-gray-50 min-h-screen pt-24 md:pt-28 pb-10">
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
            <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Gerenciar Contrato
                </h1>
                <p className="text-gray-500 mt-1">
                  Imóvel: {contract.property.title}
                </p>
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
              <ContractFlowDetails status={contract.status} />
              <ContractDetails contract={contract} />
              {contract.paymentsOrders &&
                contract.paymentsOrders.length > 0 && (
                  <PaymentsList
                    payments={contract.paymentsOrders}
                    onRegisterPaymentClick={handleOpenRegisterModal}
                  />
                )}
            </div>

            <aside className="lg:col-span-1 space-y-6">
              <ContractPartiesDetails contract={contract} />

              <ActionCard />
              <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                <h3 className="font-bold text-lg">Outras Ações</h3>
                {(contract.status === "AGUARDANDO_ASSINATURAS" ||
                  contract.status === "ATIVO") && (
                  <CustomButton
                    onClick={handleViewContract}
                    disabled={isActionLoading}
                    color="bg-green-100"
                    textColor="text-green-800"
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
                {contract.status === "AGUARDANDO_ASSINATURAS" &&
                  (sub === contract.landlordId || role === Roles.ADMIN) && (
                    <CustomButton
                      onClick={() => setShowResendModal(true)}
                      disabled={isActionLoading}
                      color="bg-blue-100"
                      textColor="text-blue-800"
                      className="w-full"
                    >
                      <BellRing className="mr-2" size={20} />
                      Reenviar Notificação de Assinatura
                    </CustomButton>
                  )}
                {(sub === contract.landlordId || role === Roles.ADMIN) && (
                  // (contract.status === "PENDENTE_DOCUMENTACAO" ||contract.status === "EM_ANALISE") &&
                  <>
                    {(contract.status === "PENDENTE_DOCUMENTACAO" ||
                      contract.status === "EM_ANALISE" ||
                      contract.status === "AGUARDANDO_ASSINATURAS") && (
                      <CustomButton
                        onClick={() => setShowActivateModal(true)}
                        disabled={isActionLoading}
                        color="bg-amber-500"
                        textColor="text-white"
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
                          textColor="text-red-800"
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
                        textColor="text-red-800"
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

      <RegisterPaymentModal
        isOpen={showRegisterPaymentModal}
        onClose={() => setShowRegisterPaymentModal(false)}
        onConfirm={handleRegisterPayment}
        isLoading={isActionLoading}
      />
    </>
  );
}
