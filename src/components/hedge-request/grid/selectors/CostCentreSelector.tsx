import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

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

  // If only one cost centre exists and no value is selected, set it automatically
  if (costCentres?.length === 1 && !value) {
    // Use setTimeout to ensure this runs after the current render cycle
    setTimeout(() => {
      node.setData({
        ...data,
        cost_centre: costCentres[0]
      });
    }, 0);
  }

  return costCentres?.length > 1 ? (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          node.setData({
            ...data,
            cost_centre: e.target.value
          });
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value="">Select Cost Centre</option>
        {costCentres.map((cc: string) => (
          <option key={cc} value={cc}>{cc}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  ) : (
    <span>{value}</span>
  );
};