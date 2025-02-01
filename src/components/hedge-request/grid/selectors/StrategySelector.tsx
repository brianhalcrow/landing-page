import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface StrategySelectorProps {
  data: any;
  value: string;
  node: any;
}

export const StrategySelector = ({ data, value, node }: StrategySelectorProps) => {
  const { data: strategies, isLoading } = useQuery({
    queryKey: ['strategies', data.exposure_category_l2],
    queryFn: async () => {
      if (!data.exposure_category_l2) return [];
      
      const { data: strategyData, error } = await supabase
        .from('hedge_strategy')
        .select('strategy, strategy_description')
        .eq('exposure_category_l2', data.exposure_category_l2);

      if (error) {
        console.error('Error fetching strategies:', error);
        toast.error('Failed to fetch strategies');
        return [];
      }

      return strategyData;
    },
    enabled: !!data.exposure_category_l2
  });

  const uniqueStrategies = Array.from(new Set(strategies?.map(s => ({
    strategy: s.strategy,
    description: s.strategy_description
  })) || []));

  // Only update if we have data and the current value doesn't match
  if (!isLoading && uniqueStrategies.length === 1 && !value) {
    setTimeout(() => {
      if (node && node.setData) {
        node.setData({
          ...data,
          strategy_description: uniqueStrategies[0].description,
          instrument: '' // Clear instrument when strategy changes
        });
      }
    }, 0);
    return <span>{uniqueStrategies[0].description}</span>;
  }

  if (uniqueStrategies.length <= 1) {
    return <span>{value}</span>;
  }

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          const newValue = e.target.value;
          const selectedStrategy = uniqueStrategies.find(s => s.description === newValue);
          if (node && node.setData) {
            node.setData({
              ...data,
              strategy_description: newValue,
              instrument: '' // Clear instrument when strategy changes
            });
          }
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.exposure_category_l2}
      >
        <option value="">Select Strategy</option>
        {uniqueStrategies.map(({ description }) => (
          <option key={description} value={description}>{description}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};