import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";
import { useEffect } from "react";

interface NewEntityFieldsProps {
  form: UseFormReturn<FormValues>;
  onValidate: (entityId: string, entityName: string, functionalCurrency?: string) => Promise<boolean>;
}

const NewEntityFields = ({ form, onValidate }: NewEntityFieldsProps) => {
  useEffect(() => {
    const subscription = form.watch(async (value, { name }) => {
      if (name === "entity_id" || name === "entity_name") {
        const entityId = form.getValues("entity_id");
        const entityName = form.getValues("entity_name");
        const functionalCurrency = form.getValues("functional_currency");

        if (entityId && entityName) {
          await onValidate(entityId, entityName, functionalCurrency);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onValidate]);

  return (
    <>
      <FormField
        control={form.control}
        name="entity_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity Name</FormLabel>
            <Input 
              placeholder="Enter entity name" 
              {...field}
              className="w-[300px]"
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity ID</FormLabel>
            <Input 
              placeholder="Enter new ID" 
              {...field}
              className="w-[100px]"
            />
          </FormItem>
        )}
      />
    </>
  );
};

export default NewEntityFields;