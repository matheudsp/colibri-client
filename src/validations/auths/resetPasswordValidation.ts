import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: "A nova senha é obrigatória" })
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string({
      required_error: "A confirmação de senha é obrigatória",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
