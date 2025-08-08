import { z } from "zod";

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(1, "O título do imóvel é obrigatório")
    .max(100, "O título deve ter no máximo 100 caracteres"),

  description: z.string().min(1, "A descrição é obrigatória"),

  cep: z
    .string()
    .min(1, "O CEP é obrigatório")
    .refine(
      (val) => val.replace(/\D/g, "").length === 9,
      "O CEP deve ter 8 dígitos"
    ),

  street: z.string().min(1, "A rua é obrigatória"),

  number: z.string().min(1, "O número é obrigatório"),

  complement: z.string().optional(),

  district: z.string().min(1, "O bairro é obrigatório"),

  city: z.string().min(1, "A cidade é obrigatória"),

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
