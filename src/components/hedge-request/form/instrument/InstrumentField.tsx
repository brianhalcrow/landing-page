import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormValues } from "../types";
import { useInstrumentField } from "./hooks/useInstrumentField";

interface InstrumentFieldProps {
  form: UseFormReturn<FormValues>;
  disabled?: boolean;
}

const InstrumentField = ({ form, disabled = true }: InstrumentFieldProps) => {
  // Watch for changes in entity_id, entity_name, and strategy
  const entityId = form.watch("entity_id");
  const entityName = form.watch("entity_name");
  const strategy = form.watch("strategy");
  const exposureL2 = form.watch("exposure_category_level_2");

  const { instruments, loading } = useInstrumentField(form, strategy, entityId, entityName);

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