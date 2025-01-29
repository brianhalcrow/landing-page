import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FormValues } from "../types";

interface EntitySelectionFieldsProps {
  form: UseFormReturn<FormValues>;
  entities: any[] | undefined;
  isLoadingEntities: boolean;
  onFetchConfig: (entityId: string) => Promise<void>;
}

const EntitySelectionFields = ({ 
  form, 
  entities, 
  isLoadingEntities,
  onFetchConfig 
}: EntitySelectionFieldsProps) => {
  return (
    <div className="flex gap-4 items-end">
      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity Name</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                if (value) {
                  onFetchConfig(value);
                }
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
      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entity ID</FormLabel>
            <div className="flex gap-2">
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  if (value) {
                    onFetchConfig(value);
                  }
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
                      value={entity.entity_id || ""}
                    >
                      {entity.entity_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => field.value && onFetchConfig(field.value)}
                  disabled={!field.value || isLoadingEntities}
                >
                  Fetch Config
                </Button>
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default EntitySelectionFields;