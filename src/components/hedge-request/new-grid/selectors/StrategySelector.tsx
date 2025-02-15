
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
  
  // Filter strategies based on selected entity
  const strategies = Array.from(new Map(
    validConfigs
      .filter(c => c.entity_id === props.data.entity_id)
      .map(c => [
        c.strategy_id,
        {
          id: c.strategy_id,
          name: c.strategy,
          description: c.strategy_description,
          instrument: c.instrument
        }
      ])
  ).values());

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStrategy = strategies.find(s => s.id.toString() === event.target.value);
    if (selectedStrategy) {
      // Only update strategy-related fields
      props.node.setData({
        ...props.data,
        strategy: selectedStrategy.id.toString(),
        strategy_name: selectedStrategy.name,
        strategy_description: selectedStrategy.description,
        instrument: selectedStrategy.instrument,
      });
    }
  };

  return (
    <select
      value={props.value}
      onChange={handleChange}
      className="w-full h-full border-0 outline-none bg-transparent"
      disabled={!props.data.entity_id}
    >
      <option value="">Select Strategy</option>
      {strategies.map(strategy => (
        <option key={strategy.id} value={strategy.id}>
          {strategy.description}
        </option>
      ))}
    </select>
  );
};
