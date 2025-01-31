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
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EntitySelectionProps {
  form: UseFormReturn<FormValues>;
  entities: Entity[] | undefined;
  isLoading: boolean;
  onEntitySelect: (field: "entity_id" | "entity_name", value: string) => void;
}

const EntitySelection = ({ form, entities, isLoading, onEntitySelect }: EntitySelectionProps) => {
  useEffect(() => {
    const fetchManagementStructure = async (entityId: string) => {
      try {
        const { data, error } = await supabase
          .from('management_structure')
          .select('*')
          .eq('entity_id', entityId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching management structure:', error);
          toast({
            title: "Error",
            description: "Failed to fetch management structure data",
            variant: "destructive",
          });
          return;
        }

        // Clear the fields if no data is found
        if (!data) {
          console.log('No management structure found for entity:', entityId);
          form.setValue('cost_centre', '');
          form.setValue('country', '');
          form.setValue('geo_level_1', '');
          form.setValue('geo_level_2', '');
          form.setValue('geo_level_3', '');
          return;
        }

        // Set the values if data exists
        form.setValue('cost_centre', data.cost_centre || '');
        form.setValue('country', data.country || '');
        form.setValue('geo_level_1', data.geo_level_1 || '');
        form.setValue('geo_level_2', data.geo_level_2 || '');
        form.setValue('geo_level_3', data.geo_level_3 || '');
      } catch (error) {
        console.error('Error in fetchManagementStructure:', error);
        toast({
          title: "Error",
          description: "Failed to fetch management structure data",
          variant: "destructive",
        });
      }
    };

    const entityId = form.watch('entity_id');
    if (entityId) {
      fetchManagementStructure(entityId);
    }
  }, [form.watch('entity_id')]);

  return (
    <>
      <FormField
        control={form.control}
        name="entity_name"
        render={({ field }) => (
          <FormItem className="w-80">
            <FormLabel className="h-14">Entity Name</FormLabel>
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
          <FormItem className="w-40">
            <FormLabel className="h-14">Entity ID</FormLabel>
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