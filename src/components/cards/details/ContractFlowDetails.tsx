import {
  FileClock,
  HandCoins,
  PenSquare,
  ShieldCheck,
  FileEdit,
  UserCheck,
  MessageSquareWarning,
} from "lucide-react";
import { FaCheck } from "react-icons/fa";
import { ContractWithDocuments } from "@/interfaces/contract";
import clsx from "clsx";

const STANDARD_STEPS_CONFIG = [
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
    id: "aceite",
  },
  {
    name: "Documentos",
    icon: FileClock,
    description: "Aguardando o envio de documentos pelo locatário.",
    statuses: ["PENDENTE_DOCUMENTACAO", "EM_ANALISE"],
  },

  // {
  //   name: "Análise",
  //   icon: FileSearch,
  //   description: "Documentos em análise pelo locador.",
  //   statuses: ["EM_ANALISE"],
  // },
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

const ALTERATION_STEP_CONFIG = {
  name: "Revisão",
  icon: MessageSquareWarning,
  description: "Locador revisa a solicitação de alteração.",
  statuses: ["SOLICITANDO_ALTERACAO"],
  id: "solicitando_alteracao",
};

export function ContractFlowDetails({
  contract,
}: {
  contract: ContractWithDocuments;
}) {
  const { status, guaranteeType } = contract;

  const displaySteps = STANDARD_STEPS_CONFIG.filter(
    (step) =>
      !step.isConditional ||
      (step.isConditional && guaranteeType === "DEPOSITO_CAUCAO")
  );

  let alterationStepIndex = -1;

  if (status === "SOLICITANDO_ALTERACAO") {
    const aceiteIndex = displaySteps.findIndex((step) => step.id === "aceite");
    if (aceiteIndex !== -1) {
      alterationStepIndex = aceiteIndex + 1;
      displaySteps.splice(alterationStepIndex, 0, ALTERATION_STEP_CONFIG);
    } else {
      // Fallback: Adiciona no final se não encontrar "Aceite" (improvável)
      displaySteps.push(ALTERATION_STEP_CONFIG);
      alterationStepIndex = displaySteps.length - 1;
    }
  }

  let currentStepVisualIndex = displaySteps.findIndex((step) =>
    step.statuses.includes(status)
  );

  if (status === "FINALIZADO") {
    currentStepVisualIndex = displaySteps.length; // Marca TUDO como concluído
  } else if (status === "CANCELADO") {
    currentStepVisualIndex = -1; // Nenhum passo ativo
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-xl shadow-xs border border-border overflow-x-auto">
      <h3 className="font-bold text-lg mb-6 text-center">Etapas do Contrato</h3>

      <div className="flex flex-col md:flex-row md:min-w-max justify-center items-stretch md:items-start space-y-4 md:space-y-0 md:space-x-1 lg:space-x-2 relative pb-8 md:pb-0">
        {displaySteps.map((step, index) => {
          const isCompleted = currentStepVisualIndex > index;
          const isCurrent = currentStepVisualIndex === index;
          const isAlterationStep = step.id === "solicitando_alteracao"; // Verifica se é o passo de alteração

          const currentIconColorClass =
            isCurrent && isAlterationStep
              ? "bg-purple-600 text-white animate-pulse" // Roxo para Revisão ativa
              : isCurrent
              ? "bg-primary text-white animate-pulse-shadow" // Verde para outros ativos
              : "";

          const currentTextColorClass =
            isCurrent && isAlterationStep
              ? "text-purple-700" // Roxo para texto de Revisão ativa
              : isCurrent
              ? "text-primary" // Verde para texto de outros ativos
              : "text-gray-800";

          const showConnectorLine = index < displaySteps.length - 1;

          const isNextStepActiveOrCompleted = currentStepVisualIndex > index;
          const connectorColorClass = isNextStepActiveOrCompleted
            ? isAlterationStep
              ? "border-purple-600"
              : "border-primary"
            : "border-gray-300";

          return (
            <div
              key={step.id || step.name}
              className={clsx(
                "flex md:flex-col items-center md:items-start w-full md:w-auto md:flex-1 relative",
                { "md:max-w-[120px]": displaySteps.length > 6 }
              )}
            >
              <div className="flex items-center md:flex-col w-full">
                <div className="flex flex-col items-center w-16 md:w-auto z-10">
                  <div
                    className={clsx(
                      `w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0`,
                      isCompleted ? "bg-primary text-white " : "",
                      currentIconColorClass,
                      !isCompleted && !isCurrent
                        ? "bg-gray-200 text-gray-500 border-2 border-gray-300"
                        : "border-2 border-transparent "
                    )}
                    title={step.description}
                  >
                    {isCompleted ? (
                      <FaCheck size={14} />
                    ) : (
                      <step.icon
                        size={20}
                        className={
                          isCurrent
                            ? "animate-wiggle-more animate-infinite animate-duration-1500 animate-ease-in-out "
                            : ""
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="ml-3 md:ml-0 md:mt-2 md:text-center flex-1 md:flex-initial md:w-full min-w-0">
                  <p
                    className={clsx(
                      "text-xs sm:text-sm font-bold break-words",
                      currentTextColorClass
                    )}
                  >
                    {step.name}
                  </p>

                  <p className="text-xs text-gray-500 md:hidden mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>

              {showConnectorLine && (
                <div
                  className={clsx(
                    "md:hidden absolute top-12 left-[1.18rem] h-full w-[2px] border-l-2 border-dashed",
                    connectorColorClass
                  )}
                  style={{ height: "calc(100% - 2.5rem)" }}
                />
              )}

              {showConnectorLine && (
                <div
                  className={clsx(
                    "hidden md:block absolute top-[1.5rem] left-[calc(50%+0.5rem)] w-full h-[2px] border-t-2 border-dashed",
                    connectorColorClass
                  )}
                  style={{ width: "calc(100% - 1rem)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
