
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
  
  const counterparties = Array.from(new Map(
    validConfigs
      .filter(c => 
        c.entity_id === props.data.entity_id && 
        c.strategy_id.toString() === props.data.strategy
      )
      .map(c => [
        c.counterparty_id,
        {
          id: c.counterparty_id,
          name: c.counterparty_name
        }
      ])
  ).values());

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCounterparty = counterparties.find(c => c.id === event.target.value);
    if (selectedCounterparty) {
      const rowIndex = props.node.rowIndex;
      props.api.gridOptionsWrapper.gridOptions.context.updateRowData(rowIndex, {
        counterparty: selectedCounterparty.id,
        counterparty_name: selectedCounterparty.name
      });
    }
  };

  return (
    <select
      value={props.value}
      onChange={handleChange}
      className="w-full h-full border-0 outline-none bg-transparent"
      disabled={!props.data.strategy}
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
