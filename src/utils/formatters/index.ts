import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Formata um valor numérico como moeda no padrão brasileiro (BRL).
 * @param value O número a ser formatado.
 * @returns A string formatada, ex: "R$ 1.500,00". Retorna uma string vazia se o valor for inválido.
 */
export const formatCurrency = (
  value: number | string | null | undefined
): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (
    numericValue === null ||
    numericValue === undefined ||
    isNaN(numericValue)
  ) {
    return "";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
};

/**
 * Formata uma data para um formato legível.
 * @param date A data (string ou objeto Date) a ser formatada.
 * @param pattern O formato desejado (padrão: 'dd/MM/yyyy').
 * @returns A string da data formatada ou uma string vazia se a data for inválida.
 */
export const formatDate = (
  date: Date | string | undefined,
  pattern = "dd/MM/yyyy"
): string => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Adiciona verificação de data válida
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    return format(dateObj, pattern, { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
};

/**
 * Converte a chave do tipo de garantia em um texto amigável.
 * @param type A chave do tipo de garantia (ex: 'DEPOSITO_CAUCAO').
 * @returns O nome formatado (ex: "Depósito Caução").
 */
export const formatGuaranteeType = (
  type: string | null | undefined
): string => {
  if (!type) {
    return "Não especificada";
  }

  const guaranteeMap: Record<string, string> = {
    DEPOSITO_CAUCAO: "Depósito Caução",
    FIADOR: "Fiador",
    SEGURO_FIANCA: "Seguro Fiança",
    SEM_GARANTIA: "Sem Garantia",
  };

  return guaranteeMap[type] || type;
};
