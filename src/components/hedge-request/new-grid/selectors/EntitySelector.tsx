import { ValidHedgeConfig } from '../types/hedgeRequest.types';
import { supabase } from "@/integrations/supabase/client";

interface EntitySelectorProps {
  value: string;
  api: any;
  data: any;
  column: any;
  node: any;
  context?: {
    validConfigs?: ValidHedgeConfig[];
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

interface Entity {
  id: string;
  name: string;
  functional_currency: string;
}

export const EntitySelector = (props: EntitySelectorProps) => {
  const validConfigs = props.context?.validConfigs || [];
  const fieldName = props.column.colDef.field;
  
  const entities = Array.from(new Map(
    validConfigs.map(config => [
      config.entity_id,
      {
        id: config.entity_id,
        name: config.entity_name,
        functional_currency: config.functional_currency
      }
    ])
  ).values());

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    let selectedEntity: Entity | undefined;
    
    // Find entity based on whether we're selecting by ID or name
    if (fieldName === 'entity_id') {
      selectedEntity = entities.find(e => e.id === selectedValue);
    } else {
      selectedEntity = entities.find(e => e.name === selectedValue);
    }

    if (selectedEntity && props.context?.updateRowData) {
      // Create updates object with correct typing
      const updates: Record<string, any> = {
        entity_id: selectedEntity.id,
        entity_name: selectedEntity.name
      };

      // Get cost centres for this entity
      try {
        const { data: costCentres } = await supabase
          .from('management_structure')
          .select('cost_centre')
          .eq('entity_id', selectedEntity.id);

        // If there's exactly one cost centre, add it to the updates
        if (costCentres && costCentres.length === 1) {
          updates.cost_centre = costCentres[0].cost_centre;
        }
      } catch (error) {
        console.error('Error fetching cost centres:', error);
      }

      props.context.updateRowData(props.node.rowIndex, updates);
    }
  };

  // Select options based on which field we're displaying
  const value = props.value || '';
  const options = entities.map(entity => ({
    value: fieldName === 'entity_id' ? entity.id : entity.name,
    label: fieldName === 'entity_id' ? entity.id : entity.name
  }));

  return (
    <select
      value={value}
      onChange={handleChange}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select {fieldName === 'entity_id' ? 'Entity ID' : 'Entity Name'}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
