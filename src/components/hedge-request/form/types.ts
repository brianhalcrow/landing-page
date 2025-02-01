import { z } from "zod";

export const formSchema = z.object({
  entity_id: z.string().min(1, "Entity ID is required"),
  entity_name: z.string().min(1, "Entity name is required"),
  cost_centre: z.string().optional(),
  functional_currency: z.string().optional(),
  exposure_category_level_4: z.string().min(1, "Category level 4 is required"),
  exposure_config: z.string().min(1, "Exposure L1 is required"),
  strategy: z.string().min(1, "Strategy is required"),
  instrument: z.string().optional(),
}).strict();

export type FormValues = z.infer<typeof formSchema>;

export interface Entity {
  entity_id: string;
  entity_name: string;
  functional_currency?: string;
}

export interface Criteria {
  entity_id: string;
  entity_name: string;
  exposure_category_level_4: string | null;
  account_category_level_1: string | null;
  subsystem_code: string | null;
  exposure_config: string | null;
}

export interface Strategy {
  id: number;
  strategy: string | null;
  strategy_description: string | null;
}