import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

export const formSchema = z.object({
  entity_id: z.string({
    required_error: "Please select an entity",
  }),
  entity_name: z.string({
    required_error: "Entity name is required",
  }),
  functional_currency: z.string().optional(),
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
}).superRefine(async (data, ctx) => {
  try {
    // Only validate if we have both entity_id and entity_name
    if (data.entity_id && data.entity_name) {
      const { data: entityConfig, error } = await supabase
        .from('config_entity')
        .select('*')
        .eq('entity_id', data.entity_id)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Failed to validate entity configuration",
          path: ["entity_id"],
        });
        return false;
      }

      if (!entityConfig) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Entity not found in configuration",
          path: ["entity_id"],
        });
        return false;
      }

      // Update form values to match database
      data.entity_name = entityConfig.entity_name;
      if (entityConfig.functional_currency) {
        data.functional_currency = entityConfig.functional_currency;
      }
    }
    return true;
  } catch (error) {
    console.error('Unexpected validation error:', error);
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Failed to validate entity configuration",
      path: ["entity_id"],
    });
    return false;
  }
}).refine(
  (data) => {
    if (data.net_monetary) {
      return !(data.monetary_assets || data.monetary_liabilities);
    }
    return true;
  },
  {
    message: "Net Monetary cannot be selected together with Monetary Assets or Monetary Liabilities",
    path: ["net_monetary"],
  }
).refine(
  (data) => {
    if (data.net_income) {
      return !(data.revenue || data.costs);
    }
    return true;
  },
  {
    message: "Net Income cannot be selected together with Revenue or Costs",
    path: ["net_income"],
  }
);

export type FormValues = z.infer<typeof formSchema>;