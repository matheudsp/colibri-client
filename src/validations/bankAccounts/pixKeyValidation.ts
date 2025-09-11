import { z } from "zod";

export const pixKeySchema = z.object({
  pixAddressKeyType: z.enum(["CPF", "CNPJ", "EMAIL", "PHONE", "EVP"], {
    required_error: "O tipo da chave PIX é obrigatório.",
  }),
  pixAddressKey: z.string().min(1, "A chave PIX é obrigatória."),
});

export type PixKeyFormValues = z.infer<typeof pixKeySchema>;
