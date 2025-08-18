import { PdfType } from "../../interfaces/pdf";

export const getPdfFileName = (
  pdfType: PdfType,
  contractId: string
): string => {
  switch (pdfType) {
    case "contrato":
      return `${contractId}-contrato.pdf`;
    default:
      return `${contractId}-${pdfType}.pdf`;
  }
};
