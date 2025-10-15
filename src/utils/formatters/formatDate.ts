import { differenceInDays, format, isToday, isFuture, isPast } from "date-fns";
export const formatDate = (
  date: Date | string,
  locale = "pt-BR",
  withTime = false
): string => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) return "";

  if (!withTime) {
    return parsedDate.toLocaleDateString(locale);
  }

  const datePart = parsedDate.toLocaleDateString(locale);
  const timePart = parsedDate
    .toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");

  return `${datePart} às ${timePart}`;
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

export const formatDateForDisplay = (
  dateString: string | undefined,
  options: { showRelative?: boolean } = {}
) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  // Garante que a data seja tratada como UTC para evitar problemas de fuso horário
  const utcDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );

  const formattedDate = format(utcDate, "dd/MM/yyyy");

  if (options.showRelative) {
    const today = new Date();
    // Zera a hora do dia atual para uma comparação precisa de "dias"
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const daysDiff = differenceInDays(utcDate, todayStart);

    if (isToday(utcDate)) {
      return `${formattedDate} (Vence hoje)`;
    }
    if (isFuture(utcDate)) {
      const plural = daysDiff === 1 ? "" : "s";
      const text =
        daysDiff === 1 ? "Vence amanhã" : `Vence em ${daysDiff} dia${plural}`;
      return `${formattedDate} (${text})`;
    }
    if (isPast(utcDate)) {
      const daysPast = Math.abs(daysDiff);
      const plural = daysPast === 1 ? "" : "s";
      return `${formattedDate} (Vencido há ${daysPast} dia${plural})`;
    }
  }

  return formattedDate;
};
