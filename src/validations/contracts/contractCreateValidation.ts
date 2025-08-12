import { z } from "zod";

export const createContractSchema = z.object({
  propertyId: z.string().min(1, "O ID da propriedade é obrigatório."),

  tenantEmail: z
    .string({ required_error: "O e-mail do inquilino é obrigatório." })
    .email("Formato de e-mail inválido."),
  tenantName: z.string().optional(),
  tenantCpfCnpj: z.string().optional(),
  tenantPassword: z.string().optional(),

  rentAmount: z
    .string({ required_error: "O valor do aluguel é obrigatório." })
    .min(1, "O valor do aluguel é obrigatório."),
  condoFee: z.string().optional(),
  iptuFee: z.string().optional(),
  securityDeposit: z.string().optional(),

  startDate: z
    .string({ required_error: "A data de início é obrigatória." })
    .min(1, "A data de início é obrigatória."),

  durationInMonths: z.coerce
    .number({ required_error: "A duração é obrigatória." })
    .int()
    .positive("A duração deve ser maior que zero."),
  guaranteeType: z.string({
    required_error: "O tipo de garantia é obrigatório.",
  }),
});

export type CreateContractFormValues = z.infer<typeof createContractSchema>;
