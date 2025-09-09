import { z } from "zod";
import { dateSchema } from "@/utils/helpers/handleDateSchema";

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome é muito longo."),
  email: z.string().email("Formato de e-mail inválido."),
  phone: z.string().min(10, "O número de celular é inválido.").optional(),
  cpfCnpj: z
    .string()
    .min(11, "CPF/CNPJ é obrigatório.")
    .max(18, "CPF/CNPJ inválido."),
  birthDate: dateSchema.optional(),

  companyType: z.string().optional(),

  // Campos de Endereço
  cep: z.string().min(8, "O CEP deve ter 8 dígitos.").optional(),
  street: z.string().min(1, "A rua é obrigatória.").optional(),
  number: z.string().min(1, "O número é obrigatório.").optional(),
  complement: z.string().optional().nullable(),
  province: z.string().min(1, "O bairro é obrigatório.").optional(), // Bairro
  city: z.string().min(1, "A cidade é obrigatória.").optional(),
  state: z.string().min(2, "O estado é obrigatório.").optional(),

  // Campo Financeiro
  incomeValue: z.string().optional(),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
