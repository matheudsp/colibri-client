import z from "zod";

export const dateSchema = z
  .string({ required_error: "A data de nascimento é obrigatória." })
  .transform((val) => val.replace(/\D/g, ""))
  .pipe(
    z.string().length(8, { message: "Formato de data inválido. Use DDMMYYYY." })
  )
  .refine(
    (val) => {
      const day = parseInt(val.substring(0, 2), 10);
      const month = parseInt(val.substring(2, 4), 10);
      const year = parseInt(val.substring(4, 8), 10);
      const date = new Date(year, month - 1, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    },
    { message: "Data inválida." }
  )
  .transform((val) => {
    const day = val.substring(0, 2);
    const month = val.substring(2, 4);
    const year = val.substring(4, 8);
    return `${year}-${month}-${day}`;
  });
