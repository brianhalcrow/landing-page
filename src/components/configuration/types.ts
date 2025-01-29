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
}).refine(
  (data) => {
    // If net_income is true, both revenue and costs must be true
    if (data.net_income) {
      return data.revenue && data.costs;
    }
    // If either revenue or costs is true, net_income must be true
    if (data.revenue || data.costs) {
      return data.net_income;
    }
    return true;
  },
  {
    message: "Net Income, Revenue, and Costs must be selected together",
    path: ["net_income"],
  }
).refine(
  (data) => {
    // If net_monetary is true, both monetary_assets and monetary_liabilities must be true
    if (data.net_monetary) {
      return data.monetary_assets && data.monetary_liabilities;
    }
    // If both monetary_assets and monetary_liabilities are true, net_monetary must be true
    if (data.monetary_assets && data.monetary_liabilities) {
      return data.net_monetary;
    }
    return true;
  },
  {
    message: "Net Monetary, Monetary Assets, and Monetary Liabilities must be selected together",
    path: ["net_monetary"],
  }
);

export type FormValues = z.infer<typeof formSchema>;