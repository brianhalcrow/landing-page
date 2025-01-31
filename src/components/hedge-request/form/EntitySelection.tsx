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
import { Entity, FormValues } from "./types";

interface EntitySelectionProps {
  form: UseFormReturn<FormValues>;
  entities: Entity[] | undefined;
  isLoading: boolean;
  onEntitySelect: (field: "entity_id" | "entity_name", value: string) => void;
}

const EntitySelection = ({ form, entities, isLoading, onEntitySelect }: EntitySelectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="entity_name"
        render={({ field }) => (
          <FormItem>
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
                  <SelectValue placeholder="Select entity name" />
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
          <FormItem>
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
                  <SelectValue placeholder="Select entity ID" />
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
    </>
  );
};

export default EntitySelection;