"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Loader2,
  ShieldCheck,
  Trash2,
  FileWarning,
  FileSignature,
} from "lucide-react";
import { toast } from "sonner";
import { type ContractWithDocuments } from "@/interfaces/contract";
import { ContractService } from "@/services/domains/contractService";
import { useAuth } from "@/hooks/useAuth";
import { CustomButton } from "@/components/forms/CustomButton";
import { ContractDetailsCard } from "@/components/cards/details/ContractCardDetails";
import { PartiesInfoCard } from "@/components/cards/details/PartiesInfoCard";
import { PaymentsList } from "@/components/lists/PaymentLists";
import { DeleteContractModal } from "@/components/modals/contractModals/DeleteContractModal";
import { contractStatus } from "@/constants/contractStatus";
import { useUserRole } from "@/hooks/useUserRole";
import { Roles } from "@/constants";
import { ForceActivateContractModal } from "@/components/modals/contractModals/ForceActivateContractModal";
import { FaRegEye } from "react-icons/fa";

export default function ContractManagementPage() {
  const [contract, setContract] = useState<ContractWithDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;
  const { role, sub } = useUserRole();
  const [showActivateModal, setShowActivateModal] = useState(false);
  useAuth();

  const fetchContract = async () => {
    if (!contractId) return;
    setLoading(true);
    try {
      const response = await ContractService.findOne(contractId);
      setContract(response.data);
    } catch (error) {
      toast.error("Contrato não encontrado ou acesso negado.");
      router.push("/contracts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [contractId]);

  const handleActivate = async () => {
    if (!contract) return;
    setIsActionLoading(true);
    try {
      await ContractService.activate(contract.id);
      toast.success("Contrato ativado com sucesso! Pagamentos gerados.");
      setShowActivateModal(false);
      await fetchContract();
    } catch (error) {
      toast.error(
        `Não foi possível ativar o contrato. ${(error as Error).message}`
      );
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
      router.push("/contracts");
    } catch (error) {
      toast.error(`Erro ao remover o contrato. ${(error as Error).message}`);
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
                  router.push(
                    `/properties/${contract.propertyId}/contracts/${contract.id}/documents`
                  )
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
                    router.push(
                      `/properties/${contract.propertyId}/contracts/${contract.id}/documents`
                    )
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
        return (
          <div className="bg-indigo-50 border-indigo-200 border p-4 rounded-xl shadow-sm text-center">
            <FileSignature className="mx-auto text-indigo-500" size={32} />
            <h3 className="font-bold text-lg mt-2">Pronto para Assinatura</h3>
            <p className="text-sm text-gray-600 mt-1">
              A documentação foi aprovada. O próximo passo é a assinatura
              digital do contrato.
            </p>
            <CustomButton
              onClick={() =>
                router.push(
                  `/properties/${contract.propertyId}/contracts/${contract.id}/sign`
                )
              }
              color="bg-indigo-600"
              textColor="text-white"
              className="w-full mt-4"
            >
              Assinar Contrato Digitalmente
            </CustomButton>
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
                  router.push(
                    `/properties/${contract.propertyId}/contracts/${contract.id}/documents`
                  )
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
                router.push(
                  `/properties/${contract.propertyId}/contracts/${contract.id}/documents`
                )
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
              onClick={() => router.push("/contracts")}
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
            <div className="lg:col-span-2 space-y-6">
              <ContractDetailsCard contract={contract} />
              {contract.paymentsOrders &&
                contract.paymentsOrders.length > 0 && (
                  <PaymentsList payments={contract.paymentsOrders} />
                )}
            </div>

            <aside className="lg:col-span-1 space-y-6">
              <PartiesInfoCard contract={contract} />

              <ActionCard />
              <div className="bg-white p-4 rounded-xl shadow-sm border space-y-3">
                <h3 className="font-bold text-lg">Outras Ações</h3>
                <CustomButton
                  onClick={() => {
                    console.log(contractId);
                  }}
                  disabled={isActionLoading}
                  color="bg-green-100"
                  textColor="text-green-800"
                  className="w-full"
                >
                  <FaRegEye className="mr-2" />
                  Visualizar Contrato
                </CustomButton>
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
                            <ShieldCheck className="mr-2" />
                            Forçar Ativação do Contrato
                          </>
                        )}
                      </CustomButton>
                    )}

                    <CustomButton
                      onClick={() => setShowDeleteModal(true)}
                      disabled={isActionLoading}
                      color="bg-red-100"
                      textColor="text-red-800"
                      className="w-full"
                    >
                      <Trash2 className="mr-2" />
                      Remover Contrato
                    </CustomButton>
                  </>
                )}
              </div>
            </aside>
          </main>
        </div>
      </div>
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
    </>
  );
}
