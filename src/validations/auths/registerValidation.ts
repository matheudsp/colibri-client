import { companyType } from "@/constants";
import { dateSchema } from "@/utils/helpers/handleDateSchema";
import { z } from "zod";

export const tenantRegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Nome é obrigatório" })
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(60, "Nome muito longo"),
    email: z
      .string({ required_error: "Email é obrigatório" })
      .email("Email inválido")
      .max(100, "Email muito longo"),
    phone: z.string().min(10, "O celular é obrigatório."),

    birthDate: dateSchema,

    cpfCnpj: z
      .string()
      .min(11, "CPF/CNPJ é obrigatório.")
      .max(14, "CPF/CNPJ inválido."),
    password: z
      .string({ required_error: "Senha é obrigatória" })
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .max(14, "Senha muito longa"),
    confirmPassword: z.string({
      required_error: "Confirmação de senha é obrigatória",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type TenantRegisterFormData = z.infer<typeof tenantRegisterSchema>;

export const landlordRegisterSchema = z
  .object({
    name: z.string().min(3, "O nome é obrigatório."),
    email: z.string().email("O e-mail é inválido."),
    password: z
      .string({ required_error: "Senha é obrigatória" })
      .min(4, "Senha deve ter pelo menos 6 caracteres")
      .max(14, "Senha muito longa"),
    confirmPassword: z.string({
      required_error: "Confirmação de senha é obrigatória",
    }),
    phone: z.string().min(10, "O celular é obrigatório."),
    cpfCnpj: z.string().min(11, "CPF/CNPJ é obrigatório."),
    cep: z
      .string()
      .min(1, "O CEP é obrigatório.")
      .transform((cep) => cep.replace(/\D/g, ""))
      .refine((cep) => cep.length === 8, {
        message: "O CEP deve conter 8 dígitos.",
      }),
    street: z.string().min(1, "A rua é obrigatória."),
    number: z.string().min(1, "O número é obrigatório."),
    province: z.string().min(1, "O bairro é obrigatório."),
    city: z.string().min(1, "A cidade é obrigatória."),
    state: z.string().min(1, "O estado é obrigatório."),
    complement: z.string().optional(),
    incomeValue: z.string(),

    birthDate: dateSchema.optional(),

    companyType: z
      .string({
        required_error: "O tipo de empresa é obrigatório",
        invalid_type_error: "Deve ser uma string",
      })
      .min(1, "Tipo de empresa é obrigatório")
      .refine((val) => companyType.some((type) => type.value === val), {
        message: "Tipo de empresa inválido",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.cpfCnpj.length > 11) {
        return !!data.companyType;
      }
      return true;
    },
    {
      message: "O tipo de empresa é obrigatório para CNPJ.",
      path: ["companyType"],
    }
  )
  .refine(
    (data) => {
      if (data.cpfCnpj.length === 11) {
        return !!data.birthDate;
      }
      return true;
    },
    {
      message: "A data de nascimento é obrigatória para CPF.",
      path: ["birthDate"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LandlordRegisterFormData = z.infer<typeof landlordRegisterSchema>;
