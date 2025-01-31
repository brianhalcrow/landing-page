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
import { Input } from "@/components/ui/input";
import { Entity, FormValues } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface EntitySelectionProps {
  form: UseFormReturn<FormValues>;
  entities: Entity[] | undefined;
  isLoading: boolean;
  onEntitySelect: (field: "entity_id" | "entity_name", value: string) => void;
}

interface ManagementStructure {
  cost_centre: string;
  country: string;
  geo_level_1: string;
  geo_level_2: string;
  geo_level_3: string;
}

const EntitySelection = ({ form, entities, isLoading, onEntitySelect }: EntitySelectionProps) => {
  const [managementStructures, setManagementStructures] = useState<ManagementStructure[]>([]);

  useEffect(() => {
    const fetchManagementStructure = async (entityId: string) => {
      try {
        const { data, error } = await supabase
          .from('management_structure')
          .select('*')
          .eq('entity_id', entityId);

        if (error) {
          console.error('Error fetching management structure:', error);
          toast({
            title: "Error",
            description: "Failed to fetch management structure data",
            variant: "destructive",
          });
          return;
        }

        if (!data || data.length === 0) {
          console.log('No management structure found for entity:', entityId);
          form.setValue('cost_centre', '');
          form.setValue('country', '');
          form.setValue('geo_level_1', '');
          form.setValue('geo_level_2', '');
          form.setValue('geo_level_3', '');
          setManagementStructures([]);
          return;
        }

        setManagementStructures(data);
        
        if (data.length === 1) {
          const structure = data[0];
          form.setValue('cost_centre', structure.cost_centre || '');
          form.setValue('country', structure.country || '');
          form.setValue('geo_level_1', structure.geo_level_1 || '');
          form.setValue('geo_level_2', structure.geo_level_2 || '');
          form.setValue('geo_level_3', structure.geo_level_3 || '');
        }
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

  const handleCostCentreSelect = (costCentre: string) => {
    const selectedStructure = managementStructures.find(
      structure => structure.cost_centre === costCentre
    );

    if (selectedStructure) {
      form.setValue('cost_centre', selectedStructure.cost_centre);
      form.setValue('country', selectedStructure.country || '');
      form.setValue('geo_level_1', selectedStructure.geo_level_1 || '');
      form.setValue('geo_level_2', selectedStructure.geo_level_2 || '');
      form.setValue('geo_level_3', selectedStructure.geo_level_3 || '');
    }
  };

  return (
    <div className="space-y-6">
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

        <FormField
          control={form.control}
          name="functional_currency"
          render={({ field }) => (
            <FormItem className="w-40">
              <FormLabel>Functional Currency</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Functional currency" readOnly className="bg-gray-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cost_centre"
          render={({ field }) => (
            <FormItem className="w-40">
              <FormLabel>Cost Centre</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCostCentreSelect(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Cost centre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {managementStructures.map((structure) => (
                    <SelectItem 
                      key={structure.cost_centre} 
                      value={structure.cost_centre}
                    >
                      {structure.cost_centre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default EntitySelection;