import { z } from "zod";

export const createContractSchema = z
  .object({
    propertyId: z.string().min(1, "O ID da propriedade é obrigatório."),
    tenantAction: z.enum(["search", "create"]),
    tenantEmail: z.string().email("Formato de e-mail inválido.").optional(),
    tenantName: z
      .string()
      .min(3, "O nome precisa ter no mínimo 3 caracteres.")
      .optional(),
    tenantPhone: z
      .string()
      .min(6, "O número de telefone precisa ter no mínimo 11 dígitos.")
      .optional(),
    tenantCpfCnpj: z.string({
      required_error: "O CPF/CNPJ do inquilino é obrigatório.",
    }),
    tenantPassword: z
      .string()
      .min(6, "A senha precisa ter no mínimo 6 caracteres.")
      .optional(),
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
  })
  .refine(
    (data) => {
      // Se a ação for 'create', todos os campos de novo usuário são obrigatórios
      if (data.tenantAction === "create") {
        return !!data.tenantName && !!data.tenantEmail && !!data.tenantPassword;
      }
      // Se a ação for 'search', eles não são necessários na validação do passo 1
      return true;
    },
    {
      // Mensagem genérica, os erros específicos virão dos campos individuais
      message: "Preencha todos os campos para cadastrar um novo inquilino.",
      // A validação pode ser associada a qualquer um dos campos condicionais
      path: ["tenantName"],
    }
  );

export type CreateContractFormValues = z.infer<typeof createContractSchema>;
