import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";

interface FunctionalCurrencyFieldProps {
  form: UseFormReturn<FormValues>;
}

const FunctionalCurrencyField = ({ form }: FunctionalCurrencyFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="functional_currency"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Functional Currency</FormLabel>
          <Input 
            placeholder="e.g. USD" 
            {...field} 
            className="w-[100px]"
          />
        </FormItem>
      )}
    />
  );
};

export default FunctionalCurrencyField;