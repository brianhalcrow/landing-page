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
}).refine(
  async (data) => {
    try {
      console.log('Starting validation with data:', {
        providedEntityId: data.entity_id,
        providedEntityName: data.entity_name,
        providedCurrency: data.functional_currency
      });

      const { data: entityConfig, error } = await supabase
        .from('config_entity')
        .select('*')
        .eq('entity_id', data.entity_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching entity config:', error);
        return false;
      }

      if (!entityConfig) {
        console.error('No entity config found for ID:', data.entity_id);
        return false;
      }

      console.log('Found entity config:', {
        configEntityId: entityConfig.entity_id,
        configEntityName: entityConfig.entity_name,
        configCurrency: entityConfig.functional_currency
      });

      // Strict comparison of values
      const idMatches = entityConfig.entity_id === data.entity_id;
      const nameMatches = entityConfig.entity_name === data.entity_name;
      const currencyMatches = !data.functional_currency || 
        entityConfig.functional_currency === data.functional_currency;

      console.log('Validation results:', {
        idMatches,
        nameMatches,
        currencyMatches,
        comparison: {
          id: `${entityConfig.entity_id} === ${data.entity_id}`,
          name: `${entityConfig.entity_name} === ${data.entity_name}`,
          currency: data.functional_currency ? 
            `${entityConfig.functional_currency} === ${data.functional_currency}` :
            'Currency validation skipped (optional)'
        }
      });

      return idMatches && nameMatches && currencyMatches;
    } catch (error) {
      console.error('Unexpected validation error:', error);
      return false;
    }
  },
  {
    message: "Entity details must match the configuration in the system",
    path: ["entity_id"],
  }
).refine(
  (data) => {
    // Only show error if net_monetary is true AND either monetary_assets or monetary_liabilities is also true
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
    // Only show error if net_income is true AND either revenue or costs is also true
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