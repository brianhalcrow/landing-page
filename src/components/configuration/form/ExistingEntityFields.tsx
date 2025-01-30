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
import { Tables } from '@/integrations/supabase/types';

interface ExistingEntityFieldsProps {
  form: UseFormReturn<FormValues>;
  entities: Tables<'config_exposures'>[] | undefined;
  isLoadingEntities: boolean;
  onFetchConfig: (entityId: string) => Promise<void>;
}

const ExistingEntityFields = ({ 
  form, 
  entities, 
  isLoadingEntities,
  onFetchConfig 
}: ExistingEntityFieldsProps) => {
  const handleEntitySelect = (value: string) => {
    if (value) {
      onFetchConfig(value);
      const selectedEntity = entities?.find(e => e.entity_id === value);
      if (selectedEntity) {
        form.setValue("entity_name", selectedEntity.entity_name);
        form.setValue("functional_currency", selectedEntity.functional_currency || "");
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity Name</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleEntitySelect(value);
              }}
              value={field.value}
              disabled={isLoadingEntities}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select name" />
              </SelectTrigger>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem 
                    key={entity.entity_id} 
                    value={entity.entity_id}
                  >
                    {entity.entity_name}
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
            <FormLabel>Entity ID</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleEntitySelect(value);
              }}
              value={field.value}
              disabled={isLoadingEntities}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select ID" />
              </SelectTrigger>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem 
                    key={entity.entity_id} 
                    value={entity.entity_id}
                  >
                    {entity.entity_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </>
  );
};

export default ExistingEntityFields;