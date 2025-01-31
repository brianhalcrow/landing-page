import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";
import { useEffect } from "react";

interface FunctionalCurrencyFieldProps {
  form: UseFormReturn<FormValues>;
  onValidate: (entityId: string, entityName: string, functionalCurrency?: string) => Promise<boolean>;
}

const FunctionalCurrencyField = ({ form, onValidate }: FunctionalCurrencyFieldProps) => {
  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (name === "functional_currency") {
        const entityId = form.getValues("entity_id");
        const entityName = form.getValues("entity_name");
        const functionalCurrency = form.getValues("functional_currency");

        if (entityId && entityName && functionalCurrency) {
          await onValidate(entityId, entityName, functionalCurrency);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onValidate]);

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