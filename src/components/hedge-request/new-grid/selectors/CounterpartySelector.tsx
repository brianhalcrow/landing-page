
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";

interface CounterpartySelectorProps {
  value: string;
  data: any;
  node: any;
}

export const CounterpartySelector = ({ value, data, node }: CounterpartySelectorProps) => {
  const { data: counterparties, isLoading } = useQuery({
    queryKey: ['counterparties', data.entity_id],
    queryFn: async () => {
      if (!data.entity_id) return [];
      
      const { data, error } = await supabase
        .from('entity_counterparty')
        .select(`
          counterparty_id,
          relationship_id
        `)
        .eq('entity_id', data.entity_id);

      if (error) throw error;
      return data;
    },
    enabled: !!data.entity_id
  });

  if (!data.entity_id) return <span>Select entity first</span>;
  if (isLoading) return <span>Loading...</span>;

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          const newValue = e.target.value;
          if (node && node.setData) {
            node.setData({
              ...data,
              counterparty: newValue
            });
          }
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.entity_id}
      >
        <option value="">Select Counterparty</option>
        {counterparties?.map((cp) => (
          <option key={cp.relationship_id} value={cp.counterparty_id}>
            {cp.counterparty_id}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
