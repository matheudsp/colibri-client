import { z } from "zod";

export const bankAccountSchema = z.object({
  pixAddressKeyType: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "EVP"], {
    required_error: "O tipo da chave PIX é obrigatório.",
  }),
  pixAddressKey: z.string().min(1, "A chave PIX é obrigatório."),
});

export type CreateBankAccountFormValues = z.infer<typeof bankAccountSchema>;
