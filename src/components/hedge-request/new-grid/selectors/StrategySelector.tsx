
import { ValidHedgeConfig } from '../types/hedgeRequest.types';

interface StrategySelectorProps {
  value: string;
  api: any;
  data: any;
  column: any;
  node: any;
  context?: {
    validConfigs?: ValidHedgeConfig[];
  };
}

export const StrategySelector = (props: StrategySelectorProps) => {
  const validConfigs = props.context?.validConfigs || [];
  const strategies = validConfigs
    .filter(c => c.entity_id === props.data.entity_id)
    .map(c => ({
      id: c.strategy_id,
      name: c.strategy,
      description: c.strategy_description,
      instrument: c.instrument
    }))
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStrategy = strategies.find(s => s.name === event.target.value);
    
    if (selectedStrategy) {
      const updatedData = {
        ...props.data,
        strategy: selectedStrategy.name,
        instrument: selectedStrategy.instrument,
        counterparty: '',
        counterparty_name: ''
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
      <option value="">Select Strategy</option>
      {strategies.map(strategy => (
        <option key={strategy.id} value={strategy.name}>
          {strategy.description}
        </option>
      ))}
    </select>
  );
};
