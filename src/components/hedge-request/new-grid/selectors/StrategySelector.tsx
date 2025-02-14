
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
    .map(c => c.strategy)
    .filter((v, i, a) => a.indexOf(v) === i);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStrategy = event.target.value;
    const config = validConfigs.find(c => 
      c.entity_id === props.data.entity_id && 
      c.strategy === selectedStrategy
    );
    
    if (config) {
      const updatedData = {
        ...props.data,
        strategy: selectedStrategy,
        instrument: config.instrument,
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
        <option key={strategy} value={strategy}>
          {strategy}
        </option>
      ))}
    </select>
  );
};
