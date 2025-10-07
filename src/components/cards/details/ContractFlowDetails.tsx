import {
  FileClock,
  FileSearch,
  FileText,
  PenSquare,
  ShieldCheck,
} from "lucide-react";
import { BiCheckDouble } from "react-icons/bi";

const statusToStep = {
  PENDENTE_DOCUMENTACAO: 2,
  EM_ANALISE: 3,
  AGUARDANDO_ASSINATURAS: 4,
  ATIVO: 5,
  FINALIZADO: 6,
  CANCELADO: -1,
};

const steps = [
  {
    name: "Criação",
    icon: FileText,
    description: "O contrato foi iniciado pelo locador.",
  },
  {
    name: "Documentos",
    icon: FileClock,
    description: "Aguardando o envio de documentos pelo locatário.",
  },
  {
    name: "Análise",
    icon: FileSearch,
    description: "Documentos em análise pelo locador.",
  },
  {
    name: "Assinatura",
    icon: PenSquare,
    description: "Aguardando as assinaturas digitais.",
  },
  {
    name: "Ativo",
    icon: ShieldCheck,
    description: "O contrato está ativo e os pagamentos serão gerados.",
  },
];

export function ContractFlowDetails({ status }: { status: string }) {
  const currentStep = statusToStep[status as keyof typeof statusToStep] || 0;

  return (
    <div className="bg-background p-4 sm:p-6 rounded-xl shadow-xs border border-border">
      <h3 className="font-bold text-lg mb-6 text-center">Etapas do Contrato</h3>

      <div className="flex flex-col md:flex-row justify-center items-stretch md:items-start space-y-4 md:space-y-0 md:space-x-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

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
                      ${isCurrent ? "bg-primary text-white" : ""}
                      ${
                        !isCompleted && !isCurrent
                          ? "bg-gray-200 text-gray-500"
                          : ""
                      }
                    `}
                  >
                    {isCompleted ? (
                      <BiCheckDouble size={24} />
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
