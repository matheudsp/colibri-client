import { z } from "zod";

export const preferencesSchema = z.object({
  notifications: z.object({
    acceptOnlineProposals: z.boolean(),
  }),
});

export type PreferencesFormValues = z.infer<typeof preferencesSchema>;
