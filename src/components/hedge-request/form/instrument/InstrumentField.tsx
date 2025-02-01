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
  const entityId = form.watch("entity_id");
  const entityName = form.watch("entity_name");
  const strategy = form.watch("strategy");

  const { instruments, loading } = useInstrumentField(form, strategy, entityId, entityName);

  const isFieldDisabled = disabled || loading || !entityId || !entityName || !strategy;

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