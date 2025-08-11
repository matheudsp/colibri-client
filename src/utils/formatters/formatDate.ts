export const formatDate = (date: Date | string, locale = "pt-BR") => {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale);
};

export const toISODate = (dateString: string): string => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString; // Retorna o original se não estiver no formato esperado
  }
  const [day, month, year] = dateString.split("/");
  // Cria o objeto de data em UTC para garantir o formato com 'Z' no final
  const dateObject = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day))
  );
  return dateObject.toISOString();
};

export const formatDateForInput = (dateString: string | undefined) => {
  if (!dateString) return "";
  return dateString
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2}\/\d{2})(\d)/, "$1/$2")
    .slice(0, 10);
};

export const formatDateForDisplay = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
