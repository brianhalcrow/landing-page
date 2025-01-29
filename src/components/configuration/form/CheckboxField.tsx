import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps {
  form: UseFormReturn<FormValues>;
  name: keyof FormValues;
  label: string;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const CheckboxField = ({ form, name, label, onCheckedChange, className }: CheckboxFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex items-center space-x-2", className)}>
          <FormControl>
            <Checkbox
              checked={field.value as boolean}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                onCheckedChange?.(checked as boolean);
              }}
            />
          </FormControl>
          <FormLabel className="font-normal leading-none my-auto">{label}</FormLabel>
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;