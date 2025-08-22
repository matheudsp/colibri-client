import { z } from "zod";

export const bankAccountSchema = z.object({
  bank: z.string().min(1, "O código do banco é obrigatório."),
  agency: z.string().min(1, "O número da agência é obrigatório."),
  account: z.string().min(1, "O número da conta é obrigatório."),
  accountType: z.enum(["CONTA_CORRENTE", "CONTA_POUPANCA"], {
    required_error: "O tipo de conta é obrigatório.",
  }),
});

export type CreateBankAccountFormValues = z.infer<typeof bankAccountSchema>;
