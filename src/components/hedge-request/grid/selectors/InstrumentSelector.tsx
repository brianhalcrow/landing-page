import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface InstrumentSelectorProps {
  data: any;
  value: string;
  node: any;
}

export const InstrumentSelector = ({ data, value, node }: InstrumentSelectorProps) => {
  const { data: instruments, isLoading } = useQuery({
    queryKey: ['instruments', data.exposure_category_l2, data.strategy],
    queryFn: async () => {
      if (!data.exposure_category_l2 || !data.strategy) return [];
      
      const { data: instrumentData, error } = await supabase
        .from('hedge_strategy')
        .select('instrument')
        .eq('exposure_category_l2', data.exposure_category_l2)
        .eq('strategy', data.strategy);

      if (error) {
        console.error('Error fetching instruments:', error);
        toast.error('Failed to fetch instruments');
        return [];
      }

      return instrumentData;
    },
    enabled: !!(data.exposure_category_l2 && data.strategy)
  });

  const uniqueInstruments = Array.from(new Set(instruments?.map(i => i.instrument) || []));

  // Only update if we have data and the current value doesn't match
  if (!isLoading && uniqueInstruments.length === 1 && !value) {
    setTimeout(() => {
      if (node && node.setData) {
        node.setData({
          ...data,
          instrument: uniqueInstruments[0]
        });
      }
    }, 0);
    return <span>{uniqueInstruments[0]}</span>;
  }

  if (uniqueInstruments.length <= 1) {
    return <span>{value}</span>;
  }

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          const newValue = e.target.value;
          if (node && node.setData) {
            node.setData({
              ...data,
              instrument: newValue
            });
          }
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.strategy}
      >
        <option value="">Select Instrument</option>
        {uniqueInstruments.map((instrument: string) => (
          <option key={instrument} value={instrument}>{instrument}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};