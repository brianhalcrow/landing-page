import * as z from "zod";

export const formSchema = z.object({
  entity_id: z.string({
    required_error: "Please select an entity",
  }),
  exposed_currency: z.string().optional(),
  created_at: z.string().optional(),
  po: z.boolean().default(false),
  ap: z.boolean().default(false),
  ar: z.boolean().default(false),
  other: z.boolean().default(false),
  revenue: z.boolean().default(false),
  costs: z.boolean().default(false),
  net_income: z.boolean().default(false),
  ap_realized: z.boolean().default(false),
  ar_realized: z.boolean().default(false),
  fx_realized: z.boolean().default(false),
  net_monetary: z.boolean().default(false),
  monetary_assets: z.boolean().default(false),
  monetary_liabilities: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;