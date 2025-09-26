import { useState } from "react";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { TbReportAnalytics } from "react-icons/tb";

import { type ContractWithDocuments } from "@/interfaces/contract";
import { PdfService } from "@/services/domains/pdfService";
import { extractAxiosError } from "@/services/api";
import { CustomButton } from "@/components/forms/CustomButton";
import { formatDate } from "@/utils/formatters/formatDate";

interface JudicialReportCardProps {
  contract: ContractWithDocuments;
  onReportGenerated: () => void;
}

export function JudicialReportCard({
  contract,
  onReportGenerated,
}: JudicialReportCardProps) {
  const [isReportLoading, setIsReportLoading] = useState(false);

  const judicialReports =
    contract.GeneratedPdf?.filter(
      (pdf) => pdf.pdfType === "RELATORIO_JUDICIAL"
    ) || [];

  const handleGenerateReport = async () => {
    setIsReportLoading(true);
    toast.info("Seu relatório está sendo gerado...", {
      description: "Isso pode levar alguns instantes. Por favor, aguarde.",
    });

    try {
      await PdfService.generateReport(contract.id, "RELATORIO_JUDICIAL");
      toast.success("Novo relatório judicial foi gerado com sucesso!");
      onReportGenerated();
    } catch (error) {
      toast.error("Falha ao gerar o relatório", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleDownloadReport = async (pdfId: string) => {
    const toastId = toast.loading("Recuperando relatório...");
    try {
      const response = await PdfService.getSignedUrl(pdfId);
      window.open(response.data.url, "_blank");
      toast.success("Relatório encontrado!", { id: toastId });
    } catch (error) {
      toast.error("Falha ao baixar o relatório", {
        id: toastId,
        description: extractAxiosError(error),
      });
    }
  };

  return (
    <div className="bg-background p-4 rounded-xl border border-border">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg">Relatórios</h3>
          <p className="text-sm text-gray-500 mt-1">
            Gere um dossiê completo com histórico de pagamentos, documentos e
            logs de comunicação para fins legais ou de auditoria.
          </p>
        </div>
        <CustomButton
          onClick={handleGenerateReport}
          disabled={isReportLoading}
          className="w-full sm:w-auto flex-shrink-0"
        >
          {isReportLoading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <TbReportAnalytics className="mr-2 text-lg" size={20} />
          )}
          <span className="inline">Gerar Novo Relatório</span>
        </CustomButton>
      </div>

      {judicialReports.length > 0 ? (
        <ul className="space-y-2">
          {judicialReports.map((report, i) => (
            <li
              key={report.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-background rounded-md border border-border"
            >
              <div className="text-sm">
                <p className="font-semibold">Relatório {i + 1}</p>
                <p className="font-light text-[11px] text-foreground-muted">
                  ID: {report.id}
                </p>
                <p className="text-gray-500">
                  Gerado em {formatDate(report.generatedAt, "pt-BR", true)}
                </p>
              </div>
              <CustomButton
                onClick={() => handleDownloadReport(report.id)}
                ghost
                className="w-full sm:w-auto"
              >
                <Download size={16} className="sm:mr-2" />
                <span className="inline">Baixar</span>
              </CustomButton>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border-dashed border-2">
          <TbReportAnalytics className="mx-auto text-gray-400" size={32} />
          <p className="mt-2 font-semibold">Nenhum relatório gerado</p>
          <p className="text-sm text-gray-500 mt-1">
            Clique no botão acima para criar o primeiro dossiê deste contrato.
          </p>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">
        Nota: Os relatórios são automaticamente excluídos após 7 dias por
        segurança. Lembre-se de salvar uma cópia antes disso.
      </p>
    </div>
  );
}
