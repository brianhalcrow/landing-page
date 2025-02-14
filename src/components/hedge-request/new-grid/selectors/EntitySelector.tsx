
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
  const entities = [...new Set(validConfigs.map(c => ({
    id: c.entity_id,
    name: c.entity_name,
    functional_currency: c.functional_currency
  })))];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEntity = entities.find(e => e.id === event.target.value);
    if (selectedEntity) {
      const updatedData = {
        ...props.data,
        entity_id: selectedEntity.id,
        entity_name: selectedEntity.name,
        strategy: '',
        instrument: '',
        counterparty: '',
        counterparty_name: '',
        currency: selectedEntity.functional_currency // Set default currency to functional currency
      };
      props.node.setData(updatedData);
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
