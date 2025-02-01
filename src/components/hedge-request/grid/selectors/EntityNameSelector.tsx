import { ValidEntity } from "../types";

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
      node.setData({
        ...data,
        entity_name: selectedEntity.entity_name,
        entity_id: selectedEntity.entity_id,
        functional_currency: selectedEntity.functional_currency,
        cost_centre: '' // Reset cost centre when entity changes
      });
    }
  };

  return (
    <select 
      value={value || ''} 
      onChange={handleChange}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select Entity</option>
      {entities.map((entity: ValidEntity) => (
        <option key={entity.entity_id} value={entity.entity_name}>
          {entity.entity_name}
        </option>
      ))}
    </select>
  );
};