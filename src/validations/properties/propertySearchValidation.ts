import { z } from "zod";

export const propertySearchSchema = z.object({
  q: z.string().optional(),
  title: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  propertyType: z.string().optional(),
  transactionType: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.enum(["createdAt", "value"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type PropertySearchFormValues = z.infer<typeof propertySearchSchema>;
