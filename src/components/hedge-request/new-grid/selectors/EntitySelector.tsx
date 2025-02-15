
import { ValidHedgeConfig } from '../types/hedgeRequest.types';

interface EntitySelectorProps {
  value: string;
  api: any;
  data: any;
  column: any;
  node: any;
  context?: {
    validConfigs?: ValidHedgeConfig[];
  };
}

export const EntitySelector = (props: EntitySelectorProps) => {
  const validConfigs = props.context?.validConfigs || [];
  
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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEntity = entities.find(e => e.id === event.target.value);
    if (selectedEntity) {
      const rowIndex = props.node.rowIndex;
      props.api.gridOptionsWrapper.gridOptions.context.updateRowData(rowIndex, {
        entity_id: selectedEntity.id,
        entity_name: selectedEntity.name
      });
    }
  };

  return (
    <select
      value={props.value}
      onChange={handleChange}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select Entity</option>
      {entities.map(entity => (
        <option key={entity.id} value={entity.id}>
          {entity.name}
        </option>
      ))}
    </select>
  );
};
