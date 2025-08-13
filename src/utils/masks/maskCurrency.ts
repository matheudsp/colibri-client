// src/utils/masks/maskCurrency.ts

/**
 * Formata um valor numérico ou uma string para o formato de moeda BRL.
 * Lida corretamente com números de ponto flutuante e strings formatadas.
 * Ex: 1200.4 -> "R$ 1.200,40"
 */
export const formatCurrency = (value: string | number): string => {
  if (value === null || value === undefined || value === "") return "";

  let numericValue: number;

  if (typeof value === "string") {
    const sanitizedValue = value.replace(/[^\d,.-]/g, "").replace(",", ".");
    numericValue = parseFloat(sanitizedValue);
  } else {
    numericValue = value;
  }

  if (isNaN(numericValue)) {
    return "";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

/**
 * Remove a formatação de uma string de moeda e retorna apenas os dígitos.
 * Mantém sua função original para uso em campos de formulário.
 * Ex: "R$ 1.200,40" -> "120040"
 */
export const unmaskCurrency = (maskedValue: string): string => {
  if (!maskedValue) return "";
  return maskedValue.replace(/\D/g, "");
};
