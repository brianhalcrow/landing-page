import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface InstrumentFieldProps {
  form: UseFormReturn<FormValues>;
  disabled?: boolean;
}

const InstrumentField = ({ form, disabled = true }: InstrumentFieldProps) => {
  const [instruments, setInstruments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstruments = async () => {
      const strategy = form.watch("strategy");
      if (!strategy) {
        setInstruments([]);
        return;
      }

      setLoading(true);
      try {
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
        const uniqueInstruments = [...new Set(data.map(item => item.instrument))].filter(Boolean) as string[];
        setInstruments(uniqueInstruments);

        // Auto-select the instrument if there's only one option
        if (uniqueInstruments.length === 1) {
          form.setValue("instrument", uniqueInstruments[0]);
        } else {
          // Reset instrument when strategy changes and there's not exactly one option
          form.setValue("instrument", "");
        }
      } catch (error) {
        console.error("Error in fetchInstruments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [form.watch("strategy")]);

  return (
    <FormField
      control={form.control}
      name="instrument"
      render={({ field }) => (
        <FormItem className="w-40">
          <FormLabel className="h-14">Instrument</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || ""}
            disabled={disabled || loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {instruments.map((instrument) => (
                <SelectItem 
                  key={instrument} 
                  value={instrument}
                >
                  {instrument}
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

export default InstrumentField;