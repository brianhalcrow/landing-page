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

  // Watch for changes in entity_id, entity_name, and strategy
  const entityId = form.watch("entity_id");
  const entityName = form.watch("entity_name");
  const strategy = form.watch("strategy");
  const exposureL2 = form.watch("exposure_category_level_2");

  useEffect(() => {
    // Reset instrument when entity changes
    form.setValue("instrument", "");
  }, [entityId, entityName]);

  useEffect(() => {
    const fetchInstruments = async () => {
      if (!strategy) {
        setInstruments([]);
        form.setValue("instrument", "");
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

        // Only auto-select if there's exactly one instrument AND we have a valid strategy
        if (uniqueInstruments.length === 1 && strategy) {
          // Add a small delay to ensure form is ready
          setTimeout(() => {
            form.setValue("instrument", uniqueInstruments[0], {
              shouldValidate: true,
              shouldDirty: true,
            });
          }, 0);
        } else if (uniqueInstruments.length !== 1) {
          // Only reset if we don't have exactly one instrument
          form.setValue("instrument", "");
        }
      } catch (error) {
        console.error("Error in fetchInstruments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [strategy]);

  // Calculate if the field should be disabled
  const isFieldDisabled = disabled || loading || !entityId || !entityName || !exposureL2;

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
            disabled={isFieldDisabled}
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