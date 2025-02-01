import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CostCentreSelectorProps {
  data: any;
  value: string;
  node: any;
}

export const CostCentreSelector = ({ data, value, node }: CostCentreSelectorProps) => {
  const { data: costCentres } = useQuery({
    queryKey: ['cost-centres', data.entity_id],
    queryFn: async () => {
      if (!data.entity_id) return [];
      
      const { data: centresData, error } = await supabase
        .from('management_structure')
        .select('cost_centre')
        .eq('entity_id', data.entity_id);

      if (error) {
        console.error('Error fetching cost centres:', error);
        toast.error('Failed to fetch cost centres');
        return [];
      }

      return centresData.map(item => item.cost_centre);
    },
    enabled: !!data.entity_id
  });

  // If only one cost centre exists, set it automatically
  if (costCentres?.length === 1 && !value) {
    node.setDataValue('cost_centre', costCentres[0]);
  }

  return costCentres?.length > 1 ? (
    <select 
      value={value || ''} 
      onChange={(e) => node.setDataValue('cost_centre', e.target.value)}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select Cost Centre</option>
      {costCentres.map((cc: string) => (
        <option key={cc} value={cc}>{cc}</option>
      ))}
    </select>
  ) : (
    <span>{value}</span>
  );
};