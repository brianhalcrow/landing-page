import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Define the base types separately
interface Strategy {
  id: number;
  strategy: string | null;
  strategy_description: string | null;
  instrument: string | null;
}

// Define a simplified version of FormValues
interface FormValues {
  exposure_category_level_4: string;
  strategy: string;
  instrument: string;
  // Add other form fields as needed
}

interface StrategyFieldProps {
  form: UseFormReturn<FormValues>;
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
        console.log("Fetching strategies for exposure L4:", exposureL4);
        const { data, error } = await supabase
          .from("hedge_strategy")
          .select("*")
          .eq("exposure_category_level_4", exposureL4);

        if (error) {
          console.error("Error fetching strategies:", error);
          throw error;
        }

        console.log("Fetched strategies:", data);
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
  }, [form]);

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
