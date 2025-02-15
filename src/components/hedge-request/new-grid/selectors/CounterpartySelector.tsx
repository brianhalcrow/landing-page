
import { ValidHedgeConfig } from '../types/hedgeRequest.types';
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

interface CounterpartySelectorProps {
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

  useEffect(() => {
    // Auto-select if there's only one counterparty and none is selected
    if (counterparties.length === 1 && !props.value && props.context?.updateRowData) {
      const counterparty = counterparties[0];
      props.context.updateRowData(props.node.rowIndex, {
        counterparty: counterparty.id,
        counterparty_name: counterparty.name
      });
    }
  }, [counterparties, props.value, props.context, props.node.rowIndex, props.data.strategy]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCounterparty = counterparties.find(c => c.id === event.target.value);
    if (selectedCounterparty && props.context?.updateRowData) {
      props.context.updateRowData(props.node.rowIndex, {
        counterparty: selectedCounterparty.id,
        counterparty_name: selectedCounterparty.name
      });
    }
  };

  return (
    <div className="relative w-full">
      <select
        value={props.value || ''}
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!props.data.strategy}
      >
        <option value=""></option>
        {counterparties.map(cp => (
          <option key={cp.id} value={cp.id}>
            {cp.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
