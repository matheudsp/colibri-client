import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome é muito longo."),
  phone: z.string().min(10, "O número de celular é inválido."),
});

export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>;
