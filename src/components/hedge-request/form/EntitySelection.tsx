import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";
import { Entity } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ManagementStructure } from "./entity-selection/types";
import EntityNameIdFields from "./entity-selection/EntityNameIdFields";
import CurrencyField from "./entity-selection/CurrencyField";
import ManagementFields from "./entity-selection/ManagementFields";
import GeoLevelFields from "./entity-selection/GeoLevelFields";

interface EntitySelectionProps {
  form: UseFormReturn<FormValues>;
  entities: Entity[] | undefined;
  isLoading: boolean;
  onEntitySelect: (field: "entity_id" | "entity_name", value: string) => void;
}

const EntitySelection = ({ 
  form, 
  entities, 
  isLoading, 
  onEntitySelect 
}: EntitySelectionProps) => {
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
        <EntityNameIdFields 
          form={form}
          entities={entities}
          isLoading={isLoading}
          onEntitySelect={onEntitySelect}
        />
        <CurrencyField form={form} />
      </div>

      <div className="flex gap-4">
        <ManagementFields 
          form={form}
          managementStructures={managementStructures}
          onCostCentreSelect={handleCostCentreSelect}
        />
        <GeoLevelFields form={form} />
      </div>
    </div>
  );
};

export default EntitySelection;