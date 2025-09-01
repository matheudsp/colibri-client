/**
 * Formata uma string de DÍGITOS (representando centavos) para um formato numérico brasileiro (ex: "1.234,56").
 * Ex: "123456" -> "1.234,56"
 */
export const formatNumeric = (digits: string | number): string => {
  if (digits === null || digits === undefined || digits === "") return "";

  const onlyDigits = String(digits).replace(/\D/g, "");
  if (onlyDigits === "") return "";

  const numericValue = Number(onlyDigits) / 100;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

/**
 * Converte uma string de DÍGITOS (centavos) para um NÚMERO decimal (reais).
 * Usado na validação do Zod ou no momento do submit.
 * Ex: "123456" -> 1234.56
 */
export const unmaskNumeric = (digits: string): number => {
  if (digits === null || digits === undefined) return NaN;

  const onlyDigits = String(digits).replace(/\D/g, "");
  if (onlyDigits === "") return NaN;

  const numericValue = Number(onlyDigits) / 100;
  return numericValue;
};
