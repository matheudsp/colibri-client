import { propertyType } from "@/constants/propertyType";

// Criamos um mapa para pesquisas rápidas, o que é mais eficiente que percorrer o array sempre.
const propertyTypeMap = new Map(
  propertyType.map((item) => [item.value, item.label])
);

/**
 * Recebe o valor do enum PropertyType do banco de dados (ex: "APARTAMENTO_DUPLEX")
 * e retorna o label formatado (ex: "Apartamento Duplex").
 * @param type O valor do enum do banco de dados.
 * @returns A string formatada ou o próprio valor se não for encontrado.
 */
export function getPropertyTypeLabel(type: string): string {
  return propertyTypeMap.get(type) || type;
}
