
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

interface CostCentreSelectorProps {
  value: string;
  data: any;
  node: any;
  context?: {
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

export const CostCentreSelector = ({ value, data, node, context }: CostCentreSelectorProps) => {
  const { data: costCentres, isLoading } = useQuery({
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

      return [...new Set(centresData.map(item => item.cost_centre))].sort();
    },
    enabled: !!data.entity_id,
    staleTime: 0
  });

  useEffect(() => {
    // Only proceed if we have cost centres data and the context
    if (!isLoading && costCentres && costCentres.length === 1 && !value && context?.updateRowData) {
      // Auto-select the only available cost centre
      context.updateRowData(node.rowIndex, {
        cost_centre: costCentres[0]
      });
    }
  }, [costCentres, value, context, node.rowIndex, isLoading]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (context?.updateRowData) {
      context.updateRowData(node.rowIndex, {
        cost_centre: event.target.value
      });
    }
  };

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.entity_id}
      >
        <option value=""></option>
        {(costCentres || []).map((cc: string) => (
          <option key={cc} value={cc}>{cc}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
