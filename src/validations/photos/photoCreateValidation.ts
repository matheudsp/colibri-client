import { z } from "zod";

export const photoSchema = z.object({
  id: z.string().optional(),
  propertyId: z.string(),
  filePath: z.string(),
  isCover: z.boolean().default(false),
});

export type PhotoSchema = z.infer<typeof photoSchema>;
