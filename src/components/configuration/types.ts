import { z } from "zod";

export const formSchema = z.object({
  entity_id: z.string(),
  entity_name: z.string(),
  functional_currency: z.string(),
  po: z.boolean(),
  ap: z.boolean(),
  ar: z.boolean(),
  other: z.boolean(),
  revenue: z.boolean(),
  costs: z.boolean(),
  net_income: z.boolean(),
  ap_realized: z.boolean(),
  ar_realized: z.boolean(),
  fx_realized: z.boolean(),
  net_monetary: z.boolean(),
  monetary_assets: z.boolean(),
  monetary_liabilities: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;

export interface Entity {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  accounting_rate_method: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}