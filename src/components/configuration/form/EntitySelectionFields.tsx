import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from "../types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";

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
  const [isNewEntity, setIsNewEntity] = useState(false);

  const handleModeToggle = () => {
    setIsNewEntity(!isNewEntity);
    // Reset form fields when toggling
    form.reset({
      entity_id: "",
      entity_name: "",
      functional_currency: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleModeToggle}
          className="text-sm"
        >
          {isNewEntity ? (
            <><Search className="h-4 w-4 mr-2" /> Search Existing</>
          ) : (
            <><PlusCircle className="h-4 w-4 mr-2" /> Add New</>
          )}
        </Button>
      </div>

      <div className="flex gap-4 items-end">
        {isNewEntity ? (
          // New Entity Input Fields
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
        ) : (
          // Existing Entity Selection Fields
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
                      if (value) {
                        onFetchConfig(value);
                        // Set entity name from selected entity
                        const selectedEntity = entities?.find(e => e.entity_id === value);
                        if (selectedEntity) {
                          form.setValue("entity_name", selectedEntity.entity_name);
                          form.setValue("functional_currency", selectedEntity.functional_currency || "");
                        }
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
                      if (value) {
                        onFetchConfig(value);
                        // Set entity name from selected entity
                        const selectedEntity = entities?.find(e => e.entity_id === value);
                        if (selectedEntity) {
                          form.setValue("entity_name", selectedEntity.entity_name);
                          form.setValue("functional_currency", selectedEntity.functional_currency || "");
                        }
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
        )}
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
      </div>
    </div>
  );
};

export default EntitySelectionFields;
