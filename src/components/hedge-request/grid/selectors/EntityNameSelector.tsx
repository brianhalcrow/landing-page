
import { ValidEntity } from "../types";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EntityNameSelectorProps {
  value: string;
  data: any;
  node: any;
  context?: {
    validEntities?: ValidEntity[];
  };
  colDef?: {
    field: string;
  };
}

export const EntityNameSelector = ({ value, data, node, context, colDef }: EntityNameSelectorProps) => {
  const entities = context?.validEntities || [];
  const isEntityId = colDef?.field === 'entity_id';
  
  const handleChange = (selectedValue: string) => {
    const selectedEntity = entities.find(
      (entity: ValidEntity) => isEntityId 
        ? entity.entity_id === selectedValue
        : entity.entity_name === selectedValue
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
    <Select
      value={value || ''}
      onValueChange={handleChange}
    >
      <SelectTrigger className="h-full w-full border-0 outline-none bg-transparent">
        <SelectValue placeholder={isEntityId ? "Select Entity ID" : "Select Entity"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {entities.map((entity: ValidEntity) => (
            <SelectItem
              key={entity.entity_id}
              value={isEntityId ? entity.entity_id : entity.entity_name}
            >
              {isEntityId ? entity.entity_id : entity.entity_name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
