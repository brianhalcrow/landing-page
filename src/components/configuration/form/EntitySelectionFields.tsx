import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../types";

interface EntitySelectionFieldsProps {
  form: UseFormReturn<FormValues>;
  entities: any[] | undefined;
  isLoadingEntities: boolean;
}

const EntitySelectionFields = ({ form, entities, isLoadingEntities }: EntitySelectionFieldsProps) => {
  return (
    <div className="flex gap-4 items-start">
      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity ID</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoadingEntities}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem 
                    key={entity.entity_id} 
                    value={entity.entity_id || ""}
                  >
                    {entity.entity_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity Name</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isLoadingEntities}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select name" />
              </SelectTrigger>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem 
                    key={entity.entity_id} 
                    value={entity.entity_id || ""}
                  >
                    {entity.entity_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};

export default EntitySelectionFields;