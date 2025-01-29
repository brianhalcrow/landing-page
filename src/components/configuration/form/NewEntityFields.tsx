import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../types";

interface NewEntityFieldsProps {
  form: UseFormReturn<FormValues>;
}

const NewEntityFields = ({ form }: NewEntityFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default NewEntityFields;