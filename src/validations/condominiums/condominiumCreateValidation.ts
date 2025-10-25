import { z } from "zod";

export const createCondominiumSchema = z.object({
  name: z.string().min(3, "O nome do condomínio é obrigatório."),

  cep: z
    .string()
    .min(1, "O CEP é obrigatório")
    .transform((cep) => cep.replace(/\D/g, ""))
    .refine((cep) => cep.length === 8, {
      message: "O CEP deve conter 8 dígitos.",
    }),

  street: z.string().min(1, "A rua é obrigatória."),
  number: z.string().min(1, "O número é obrigatório."),
  province: z.string().min(1, "O bairro é obrigatório."),
  city: z.string().min(1, "A cidade é obrigatória."),
  state: z.string().min(1, "O estado é obrigatório"),
});

export type CreateCondominiumFormValues = z.infer<
  typeof createCondominiumSchema
>;
