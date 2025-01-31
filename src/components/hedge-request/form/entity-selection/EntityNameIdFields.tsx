import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Entity, FormValues } from "../types";

interface EntityNameIdFieldsProps {
  form: UseFormReturn<FormValues>;
  entities: Entity[] | undefined;
  isLoading: boolean;
  onEntitySelect: (field: "entity_id" | "entity_name", value: string) => void;
}

const EntityNameIdFields = ({ 
  form, 
  entities, 
  isLoading, 
  onEntitySelect 
}: EntityNameIdFieldsProps) => {
  return (
    <div className="flex gap-4">
      <FormField
        control={form.control}
        name="entity_name"
        render={({ field }) => (
          <FormItem className="w-80">
            <FormLabel>Entity Name</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onEntitySelect("entity_name", value);
              }}
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Entity Name" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem key={entity.entity_id} value={entity.entity_name}>
                    {entity.entity_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="entity_id"
        render={({ field }) => (
          <FormItem className="w-40">
            <FormLabel>Entity ID</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onEntitySelect("entity_id", value);
              }}
              value={field.value}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Entity ID" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {entities?.map((entity) => (
                  <SelectItem key={entity.entity_id} value={entity.entity_id}>
                    {entity.entity_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EntityNameIdFields;