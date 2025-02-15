
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
        c.strategy_name === props.data.strategy_name
      )
      .map(c => [
        c.counterparty_name,
        {
          name: c.counterparty_name
        }
      ])
  ).values());

  useEffect(() => {
    // Auto-select if there's only one counterparty and none is selected
    if (counterparties.length === 1 && !props.data.counterparty_name && props.context?.updateRowData) {
      const counterparty = counterparties[0];
      props.context.updateRowData(props.node.rowIndex, {
        counterparty_name: counterparty.name
      });
    }
  }, [counterparties, props.data.counterparty_name, props.context, props.node.rowIndex, props.data.strategy_name]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCounterparty = counterparties.find(c => c.name === event.target.value);
    if (selectedCounterparty && props.context?.updateRowData) {
      props.context.updateRowData(props.node.rowIndex, {
        counterparty_name: selectedCounterparty.name
      });
    }
  };

  return (
    <div className="relative w-full">
      <select
        value={props.data.counterparty_name || ''}
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!props.data.strategy_name}
      >
        <option value=""></option>
        {counterparties.map(cp => (
          <option key={cp.name} value={cp.name}>
            {cp.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
