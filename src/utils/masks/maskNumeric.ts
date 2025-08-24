/**
 * Formata uma string de dígitos para um formato numérico brasileiro (ex: "1.234,56").
 */
export const formatNumeric = (value: string | number): string => {
  if (value === null || value === undefined) return "";

  const onlyDigits = String(value).replace(/\D/g, "");

  if (onlyDigits === "") return "";

  const numericValue = Number(onlyDigits) / 100;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

/**
 * Converte uma string de DÍGITOS (centavos) para um NÚMERO decimal (reais).
 * Ex: "300000" (do formulário) -> 3000.00 (para a API)
 */
export const unmaskNumeric = (digits: string): number => {
  if (!digits) return NaN;

  // 1. Garante que estamos lidando apenas com dígitos
  const onlyDigits = digits.replace(/\D/g, "");
  if (onlyDigits === "") return NaN;

  // 2. Converte para número e divide por 100 para obter o valor em reais
  const numericValue = Number(onlyDigits) / 100;

  return numericValue;
};
