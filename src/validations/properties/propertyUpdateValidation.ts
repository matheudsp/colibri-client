import { z } from "zod";
import { propertyType } from "@/constants";

export const updatePropertySchema = z.object({
  title: z
    .string()
    .min(1, "O título do imóvel é obrigatório")
    .max(100, "O título deve ter no máximo 100 caracteres")
    .optional(),
  propertyType: z
    .string()
    .min(1, "Tipo do imóvel é obrigatório")
    .refine((val) => propertyType.some((type) => type.value === val), {
      message: "Tipo do imóvel inválido",
    })
    .optional(),
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .max(250, "A descrição deve ter no máximo 250 caracteres")
    .optional(),

  cep: z
    .string()
    .min(1, "O CEP é obrigatório")
    .transform((cep) => cep.replace(/\D/g, ""))
    .refine((cep) => cep.length === 8, {
      message: "O CEP deve conter 8 dígitos.",
    })
    .optional(),

  street: z.string().min(1, "A rua é obrigatória").optional(),

  number: z.string().min(1, "O número é obrigatório").optional(),

  complement: z.string().optional(),

  district: z.string().min(1, "O bairro é obrigatório").optional(),

  city: z.string().min(1, "A cidade é obrigatória").optional(),

  // Renomeado de 'rentValue' para 'value' para consistência
  value: z
    .string({ required_error: "O valor do aluguel é obrigatório." })
    .min(1, "O valor do aluguel é obrigatório.")
    .optional(),

  state: z.string().min(1, "O estado é obrigatório.").optional(),

  areaInM2: z.coerce
    .number({
      invalid_type_error: "A área deve ser um número",
    })
    .min(1, "A área deve ser maior que 0")
    .optional(),

  numRooms: z.coerce
    .number({
      invalid_type_error: "O número de quartos deve ser um número",
    })
    .min(0, "O número de quartos não pode ser negativo")
    .optional(),

  numBathrooms: z.coerce
    .number({
      invalid_type_error: "O número de banheiros deve ser um número",
    })
    .min(0, "O número de banheiros não pode ser negativo")
    .optional(),

  numParking: z.coerce
    .number({
      invalid_type_error: "O número de vagas deve ser um número",
    })
    .min(0, "O número de vagas não pode ser negativo")
    .optional(),

  isAvailable: z
    .boolean({
      required_error: "É necessário informar a disponibilidade",
    })
    .optional(),
});

export type UpdatePropertyFormValues = z.infer<typeof updatePropertySchema>;
