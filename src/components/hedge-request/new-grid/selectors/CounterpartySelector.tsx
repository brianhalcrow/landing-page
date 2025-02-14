
import { ValidHedgeConfig } from '../types/hedgeRequest.types';

interface CounterpartySelectorProps {
  value: string;
  api: any;
  data: any;
  column: any;
  node: any;
  context?: {
    validConfigs?: ValidHedgeConfig[];
  };
}

export const CounterpartySelector = (props: CounterpartySelectorProps) => {
  const validConfigs = props.context?.validConfigs || [];
  const counterparties = validConfigs
    .filter(c => 
      c.entity_id === props.data.entity_id && 
      c.strategy === props.data.strategy
    )
    .map(c => ({
      id: c.counterparty_id,
      name: c.counterparty_name
    }));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCounterparty = counterparties.find(c => c.id === event.target.value);
    if (selectedCounterparty) {
      const updatedData = {
        ...props.data,
        counterparty: selectedCounterparty.id,
        counterparty_name: selectedCounterparty.name
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
      <option value="">Select Counterparty</option>
      {counterparties.map(cp => (
        <option key={cp.id} value={cp.id}>
          {cp.name}
        </option>
      ))}
    </select>
  );
};
