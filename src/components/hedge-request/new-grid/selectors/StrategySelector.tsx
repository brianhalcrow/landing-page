
import { ValidHedgeConfig } from '../types/hedgeRequest.types';
import { ChevronDown } from "lucide-react";

interface StrategySelectorProps {
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

export const StrategySelector = (props: StrategySelectorProps) => {
  const validConfigs = props.context?.validConfigs || [];
  
  const strategies = Array.from(new Map(
    validConfigs
      .filter(c => c.entity_id === props.data.entity_id)
      .map(c => [
        c.strategy_id,
        {
          id: c.strategy_id,
          name: c.strategy_name,
          description: c.strategy_description,
          instrument: c.instrument
        }
      ])
  ).values());

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStrategy = strategies.find(s => s.id.toString() === event.target.value);
    if (selectedStrategy && props.context?.updateRowData) {
      props.context.updateRowData(props.node.rowIndex, {
        strategy_id: selectedStrategy.id.toString(),
        strategy_name: selectedStrategy.name,
        strategy_description: selectedStrategy.description,
        instrument: selectedStrategy.instrument,
        // Clear counterparty when strategy changes
        counterparty_name: ''
      });
    }
  };

  return (
    <div className="relative w-full">
      <select
        value={props.data.strategy_id || ''}
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!props.data.entity_id}
      >
        <option value=""></option>
        {strategies.map(strategy => (
          <option key={strategy.id} value={strategy.id}>
            {strategy.description}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
