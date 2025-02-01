import { useEffect, useState } from "react";
import type { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "../types";

interface Strategy {
  id: number;
  strategy: string | null;
  strategy_description: string | null;
  instrument: string | null;
}

interface StrategyFieldProps {
  form: {
    control: Control<FormValues>;
    getValues: (field: keyof FormValues) => string;
    setValue: (field: keyof FormValues, value: string) => void;
  };
  disabled?: boolean;
}

const StrategyField = ({ form, disabled = false }: StrategyFieldProps) => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      const exposureL4 = form.getValues("exposure_category_level_4");
      if (!exposureL4) {
        setStrategies([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("hedge_strategy")
          .select("*")
          .eq("exposure_category_level_4", exposureL4);

        if (error) {
          console.error("Error fetching strategies:", error);
          throw error;
        }

        setStrategies(data || []);
        form.setValue("strategy", "");
        form.setValue("instrument", "");
      } catch (error) {
        console.error("Error in fetchStrategies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, [form.getValues, form.setValue]);

  return (
    <FormField
      control={form.control}
      name="strategy"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel className="h-14">Strategy</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled || loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {strategies.map((strategy) => (
                <SelectItem 
                  key={strategy.id} 
                  value={strategy.strategy_description || ""}
                >
                  {strategy.strategy_description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StrategyField;
