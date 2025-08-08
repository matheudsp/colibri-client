import z from "zod";

export const dateSchema = z
  .string({ required_error: "A data de nascimento é obrigatória." })
  .refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: "Formato de data inválido. Use DD/MM/AAAA.",
  })
  .refine(
    (val) => {
      const [day, month, year] = val.split("/").map(Number);
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
    const [day, month, year] = val.split("/");
    return `${year}-${month}-${day}`;
  });
