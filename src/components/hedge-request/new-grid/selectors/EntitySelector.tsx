
import { ValidHedgeConfig } from '../types/hedgeRequest.types';
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";

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
    let selectedEntity = entities.find(e => e.name === selectedValue);

    if (selectedEntity && props.context?.updateRowData) {
      try {
        const { data: costCentres } = await supabase
          .from('erp_mgmt_structure')
          .select('cost_centre')
          .eq('entity_id', selectedEntity.id)
          .limit(1);

        props.context.updateRowData(props.node.rowIndex, {
          entity_id: selectedEntity.id,
          entity_name: selectedEntity.name,
          cost_centre: costCentres?.[0]?.cost_centre || ''
        });
      } catch (error) {
        console.error('Error fetching cost centre:', error);
      }
    }
  };

  return (
    <div className="relative w-full">
      <select
        value={props.value || ''}
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value="">Select Entity</option>
        {entities.map(entity => (
          <option key={entity.id} value={entity.name}>
            {entity.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
