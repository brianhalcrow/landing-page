import { z } from "zod";

export const formSchema = z.object({
  entity_id: z.string().min(1, "Entity ID is required"),
  entity_name: z.string().min(1, "Entity name is required"),
  cost_centre: z.string().optional(),
  country: z.string().optional(),
  geo_level_1: z.string().optional(),
  geo_level_2: z.string().optional(),
  geo_level_3: z.string().optional(),
  functional_currency: z.string().optional(),
  exposure_category_level_2: z.string().min(1, "Category level 2 is required"),
  exposure_category_level_3: z.string().min(1, "Category level 3 is required"),
  exposure_category_level_4: z.string().min(1, "Category level 4 is required"),
  exposure_config: z.string().optional(),
  strategy: z.string().optional(),
  instrument: z.string().optional(),
}).strict(); // Added strict() to prevent excessive type instantiation

export type FormValues = z.infer<typeof formSchema>;

export interface Entity {
  entity_id: string;
  entity_name: string;
  functional_currency?: string;
}

export interface Criteria {
  entity_id: string;
  entity_name: string;
  exposure_category_level_1: string | null;
  exposure_category_level_2: string | null;
  exposure_category_level_3: string | null;
  exposure_category_level_4: string | null;
  account_category_level_1: string | null;
  subsystem_code: string | null;
  exposure_config: string | null;
}