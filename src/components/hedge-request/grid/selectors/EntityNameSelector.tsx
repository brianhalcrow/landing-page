import { ValidEntity } from "../types";
import { ChevronDown } from "lucide-react";

interface EntityNameSelectorProps {
  value: string;
  data: any;
  node: any;
  context: {
    validEntities: ValidEntity[];
  };
}

export const EntityNameSelector = ({ value, data, node, context }: EntityNameSelectorProps) => {
  const entities = context.validEntities || [];
  
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEntity = entities.find(
      (entity: ValidEntity) => entity.entity_name === event.target.value
    );
    
    if (selectedEntity) {
      // Update all relevant fields while maintaining other values
      node.setData({
        ...data,
        entity_name: selectedEntity.entity_name,
        entity_id: selectedEntity.entity_id,
        functional_currency: selectedEntity.functional_currency,
        // Reset dependent fields
        cost_centre: '',
        exposure_category_l1: '',
        exposure_category_l2: '',
        exposure_category_l3: '',
      });
    }
  };

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value="">Select Entity</option>
        {entities.map((entity: ValidEntity) => (
          <option key={entity.entity_id} value={entity.entity_name}>
            {entity.entity_name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};