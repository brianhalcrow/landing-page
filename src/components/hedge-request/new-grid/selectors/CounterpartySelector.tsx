
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";
import { CounterpartySelectorProps, EntityCounterparty } from "../types/hedgeRequest.types";

export const CounterpartySelector = ({ value, data, node }: CounterpartySelectorProps) => {
  const { data: counterparties, isLoading } = useQuery<EntityCounterparty[]>({
    queryKey: ['counterparties', data?.entity_id],
    queryFn: async () => {
      if (!data?.entity_id) return [];
      
      const { data: result, error } = await supabase
        .from('entity_counterparty')
        .select(`
          counterparty_id,
          relationship_id,
          entity_id,
          counterparty!inner (
            counterparty_name
          )
        `)
        .eq('entity_id', data.entity_id);

      if (error) throw error;
      
      // Transform the result to match our EntityCounterparty interface
      return result.map(item => ({
        counterparty_id: item.counterparty_id,
        counterparty_name: item.counterparty.counterparty_name,
        relationship_id: item.relationship_id,
        entity_id: item.entity_id
      }));
    },
    enabled: !!data?.entity_id
  });

  if (!data?.entity_id) return <span>Select entity first</span>;
  if (isLoading) return <span>Loading...</span>;

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          const selectedCounterparty = counterparties?.find(
            cp => cp.counterparty_id === e.target.value
          );
          if (node?.setData && selectedCounterparty) {
            node.setData({
              ...data,
              counterparty: selectedCounterparty.counterparty_id,
              counterparty_name: selectedCounterparty.counterparty_name
            });
          }
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data?.entity_id}
      >
        <option value="">Select Counterparty</option>
        {counterparties?.map((cp) => (
          <option key={cp.relationship_id} value={cp.counterparty_id}>
            {cp.counterparty_name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
