export function slugify(text: string): string {
  if (!text) return "";

  return text
    .toString()
    .normalize("NFD") // Separa acentos dos caracteres
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por -
    .replace(/[^\w-]+/g, "") // Remove caracteres não-alfanuméricos (exceto -)
    .replace(/--+/g, "-"); // Remove hífens duplicados
}
