
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

interface CostCentreSelectorProps {
  value: string;
  data: any;
  node: any;
}

export const CostCentreSelector = ({ value, data, node }: CostCentreSelectorProps) => {
  const { data: costCentres } = useQuery({
    queryKey: ['cost-centres', data.entity_id],
    queryFn: async () => {
      if (!data.entity_id) return [];
      
      const { data: centresData, error } = await supabase
        .from('erp_mgmt_structure')
        .select('cost_centre')
        .eq('entity_id', data.entity_id);

      if (error) {
        console.error('Error fetching cost centres:', error);
        toast.error('Failed to fetch cost centres');
        return [];
      }

      console.log('Fetched cost centres:', centresData); // Debug log
      return [...new Set(centresData.map(item => item.cost_centre))].sort();
    },
    enabled: !!data.entity_id,
    staleTime: 0, // Consider data stale immediately
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true // Refetch when window gains focus
  });

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    node.setData({
      ...data,
      cost_centre: event.target.value
    });
  };

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.entity_id}
      >
        <option value="">Select Cost Centre</option>
        {(costCentres || []).map((cc: string) => (
          <option key={cc} value={cc}>{cc}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
