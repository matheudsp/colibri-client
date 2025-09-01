import { propertyType } from "@/constants";
import { z } from "zod";

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(1, "O título do imóvel é obrigatório")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  propertyType: z
    .string({
      required_error: "O tipo de empresa é obrigatório",
      invalid_type_error: "Deve ser uma string",
    })
    .min(1, "Tipo do imóvel é obrigatório")
    .refine((val) => propertyType.some((type) => type.value === val), {
      message: "Tipo do imóvel inválido",
    }),
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(250, "A descrição deve ter no máximo 250 caracteres"),

  cep: z
    .string()
    .min(1, "O CEP é obrigatório")
    .transform((cep) => cep.replace(/\D/g, ""))
    .refine((cep) => cep.length === 8, {
      message: "O CEP deve conter 8 dígitos.",
    }),

  street: z.string().min(1, "A rua é obrigatória"),

  number: z.string().min(1, "O número é obrigatório"),

  complement: z.string().optional(),

  district: z.string().min(1, "O bairro é obrigatório"),

  city: z.string().min(1, "A cidade é obrigatória"),
  rentValue: z
    .string({ required_error: "O valor do aluguel é obrigatório." })
    .min(1, "O valor do aluguel é obrigatório."),
  state: z
    .string()
    .min(2, "O estado é obrigatório")
    .max(2, "O estado deve conter apenas a sigla (UF)"),

  areaInM2: z.coerce
    .number({
      invalid_type_error: "A área deve ser um número",
    })
    .min(1, "A área deve ser maior que 0"),

  numRooms: z.coerce
    .number({
      invalid_type_error: "O número de quartos deve ser um número",
    })
    .min(0, "O número de quartos não pode ser negativo"),

  numBathrooms: z.coerce
    .number({
      invalid_type_error: "O número de banheiros deve ser um número",
    })
    .min(0, "O número de banheiros não pode ser negativo"),

  numParking: z.coerce
    .number({
      invalid_type_error: "O número de vagas deve ser um número",
    })
    .min(0, "O número de vagas não pode ser negativo"),

  isAvailable: z.boolean({
    required_error: "É necessário informar a disponibilidade",
  }),
});

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>;
