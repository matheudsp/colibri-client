import { cnpjMask } from "./maskCNPJ";
import { cpfMask } from "./maskCPF";

/**
 * Aplica dinamicamente a máscara de CPF ou CNPJ com base no comprimento do valor.
 */
export const cpfCnpjMask = (value: string): string => {
  if (!value) return "";

  const onlyDigits = value.replace(/\D/g, "");

  if (onlyDigits.length > 11) {
    return cnpjMask(value); // Aplica máscara de CNPJ se tiver mais de 11 dígitos
  }

  return cpfMask(value); // Caso contrário, aplica a de CPF
};
