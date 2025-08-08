/**
 * Formata um valor numérico ou string de dígitos para o formato de moeda BRL.
 * Ex: 123456 -> "R$ 1.234,56"
 */
export const formatCurrency = (value: string | number): string => {
  if (value === null || value === undefined) return "";

  // Remove tudo que não for dígito
  const onlyDigits = String(value).replace(/\D/g, "");

  if (onlyDigits === "") return "";

  // Transforma a string de dígitos em um número (ex: '12345' se torna 123.45)
  const numericValue = Number(onlyDigits) / 100;

  // Usa a API Intl.NumberFormat para formatar como moeda brasileira
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
};

/**
 * Pega uma string de moeda formatada e retorna apenas os dígitos.
 * Ex: "R$ 1.234,56" -> "123456"
 */
export const unmaskCurrency = (maskedValue: string): string => {
  if (!maskedValue) return "";
  return maskedValue.replace(/\D/g, "");
};
