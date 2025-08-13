/**
 * Formata uma string de dígitos para um formato numérico brasileiro (ex: "1.234,56").
 */
export const formatNumeric = (value: string | number): string => {
  if (value === null || value === undefined) return "";

  const onlyDigits = String(value).replace(/\D/g, "");

  if (onlyDigits === "") return "";

  const numericValue = Number(onlyDigits) / 100;

  // Usa Intl.NumberFormat para obter a formatação correta (pontos e vírgula)
  // mas sem o estilo de moeda.
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

/**
 * Converte uma string numérica formatada (ex: "1.234,56") para um número (ex: 1234.56).
 */
export const unmaskNumeric = (maskedValue: string): number => {
  if (!maskedValue) return NaN;

  // 1. Remove os pontos de milhar.
  // 2. Substitui a vírgula decimal por um ponto.
  const sanitized = maskedValue.replace(/\./g, "").replace(",", ".");

  // Retorna o valor como número ou NaN se a conversão falhar.
  return parseFloat(sanitized);
};
