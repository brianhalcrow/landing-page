import { supabase } from "@/integrations/supabase/client";

export const fetchInstrumentsForStrategy = async (strategy: string) => {
  console.log("Fetching instruments for strategy:", strategy);
  const { data, error } = await supabase
    .from("hedge_strategy")
    .select("instrument")
    .eq("strategy_description", strategy)
    .not("instrument", "is", null);

  if (error) {
    console.error("Error fetching instruments:", error);
    throw error;
  }

  console.log("Fetched instruments:", data);
  return data;
};

export const getUniqueInstruments = (data: { instrument: string | null }[]) => {
  return [...new Set(data.map(item => item.instrument))].filter(Boolean) as string[];
};