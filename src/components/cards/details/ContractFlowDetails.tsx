import {
  FileClock,
  FileSearch,
  HandCoins,
  PenSquare,
  ShieldCheck,
  FileEdit,
  UserCheck,
} from "lucide-react";
import { FaCheck } from "react-icons/fa";
import { ContractWithDocuments } from "@/interfaces/contract";

const STEPS_CONFIG = [
  {
    name: "Elaboração",
    icon: FileEdit,
    description: "O locador prepara os termos do contrato.",
    statuses: ["EM_ELABORACAO"],
  },
  {
    name: "Aceite",
    icon: UserCheck,
    description: "Aguardando o inquilino revisar e aceitar os termos.",
    statuses: ["AGUARDANDO_ACEITE_INQUILINO"],
  },
  {
    name: "Documentos",
    icon: FileClock,
    description: "Aguardando o envio de documentos pelo locatário.",
    statuses: ["PENDENTE_DOCUMENTACAO"],
  },
  {
    name: "Análise",
    icon: FileSearch,
    description: "Documentos em análise pelo locador.",
    statuses: ["EM_ANALISE"],
  },
  {
    name: "Assinatura",
    icon: PenSquare,
    description: "Aguardando as assinaturas digitais.",
    statuses: ["AGUARDANDO_ASSINATURAS"],
  },
  {
    name: "Garantia",
    icon: HandCoins,
    description: "Aguardando o pagamento do depósito caução.",
    statuses: ["AGUARDANDO_GARANTIA"],
    isConditional: true,
  },
  {
    name: "Ativo",
    icon: ShieldCheck,
    description: "O contrato está ativo e os pagamentos serão gerados.",
    statuses: ["ATIVO", "FINALIZADO"],
  },
];

export function ContractFlowDetails({
  contract,
}: {
  contract: ContractWithDocuments;
}) {
  const { status, guaranteeType } = contract;

  // Filtra as etapas a serem exibidas com base na necessidade da garantia
  const steps = STEPS_CONFIG.filter(
    (step) =>
      !step.isConditional ||
      (step.isConditional && guaranteeType === "DEPOSITO_CAUCAO")
  );

  // Encontra o índice da etapa atual com base no status do contrato
  let currentStepIndex = steps.findIndex((step) =>
    step.statuses.includes(status)
  );

  // Casos especiais para o final do fluxo
  if (status === "FINALIZADO") {
    currentStepIndex = steps.length; // Marca todas as etapas como concluídas
  } else if (status === "CANCELADO") {
    currentStepIndex = -1; // Nenhuma etapa é marcada como atual ou concluída
  }

  return (
    <div className="bg-background p-4 sm:p-6 rounded-xl shadow-xs border border-border">
      <h3 className="font-bold text-lg mb-6 text-center">Etapas do Contrato</h3>
      <div className="flex flex-col md:flex-row justify-center items-stretch md:items-start space-y-4 md:space-y-0 md:space-x-2">
        {steps.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isCurrent = currentStepIndex === index;

          return (
            <div
              key={step.name}
              className="flex md:flex-col items-center w-full"
            >
              <div className="flex items-center md:flex-col w-full">
                <div className="flex flex-col items-center w-20">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      ${isCompleted ? "bg-green-500 text-white" : ""}
                      ${
                        isCurrent
                          ? "bg-primary text-white animate-pulse-shadow"
                          : ""
                      }
                      ${
                        !isCompleted && !isCurrent
                          ? "bg-gray-200 text-gray-500"
                          : ""
                      }
                    `}
                  >
                    {isCompleted ? (
                      <FaCheck size={12} />
                    ) : (
                      <step.icon
                        size={24}
                        className={isCurrent ? "animate-wiggle" : ""}
                      />
                    )}
                  </div>
                </div>

                <div className="ml-4 md:ml-0 md:mt-2 flex-1 md:flex-initial">
                  <p
                    className={`text-sm md:text-center font-bold ${
                      isCurrent ? "text-primary" : "text-gray-800"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500 md:hidden">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="md:hidden h-6 w-1 -translate-y-6 translate-x-[2.4rem] border-l-2 border-dashed border-border" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
