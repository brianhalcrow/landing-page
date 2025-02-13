
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";

interface StrategySelectorProps {
  value: string;
  data: any;
  node: any;
}

export const StrategySelector = ({ value, data, node }: StrategySelectorProps) => {
  const { data: strategies, isLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_strategy')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <span>Loading...</span>;

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          const selectedStrategy = strategies?.find(
            s => s.strategy === e.target.value
          );
          if (selectedStrategy && node.setData) {
            node.setData({
              ...data,
              strategy: selectedStrategy.strategy,
              strategy_description: selectedStrategy.strategy_description,
              instrument: selectedStrategy.instrument
            });
          }
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value="">Select Strategy</option>
        {strategies?.map((strategy) => (
          <option key={strategy.id} value={strategy.strategy}>
            {strategy.strategy}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
