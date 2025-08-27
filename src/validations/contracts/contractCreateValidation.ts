import { z } from "zod";

const baseContractSchema = z.object({
  propertyId: z.string().min(1, "O ID da propriedade é obrigatório."),
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

const createTenantSchema = z.object({
  tenantAction: z.literal("create"),
  tenantName: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."),
  tenantEmail: z.string().email("Formato de e-mail inválido."),
  tenantPhone: z
    .string()
    .min(11, "O telefone precisa ter no mínimo 11 dígitos."),
  tenantCpfCnpj: z.string().min(11, "O CPF/CNPJ é obrigatório."),
  tenantPassword: z
    .string()
    .min(6, "A senha precisa ter no mínimo 6 caracteres."),
});

const searchTenantSchema = z.object({
  tenantAction: z.literal("search"),
  tenantCpfCnpj: z.string().min(11, "O CPF/CNPJ é obrigatório para a busca."),
  tenantEmail: z.string().optional(),
  tenantName: z.string().optional(),
  tenantPhone: z.string().optional(),
  tenantPassword: z.string().optional(),
});

export const createContractSchema = z.discriminatedUnion("tenantAction", [
  baseContractSchema.merge(createTenantSchema),
  baseContractSchema.merge(searchTenantSchema),
]);

export type CreateContractFormValues = z.infer<typeof createContractSchema>;
