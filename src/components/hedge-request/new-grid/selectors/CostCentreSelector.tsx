
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
  const { data: costCentres, isLoading, error } = useQuery({
    queryKey: ['cost-centres'],
    queryFn: async () => {
      try {
        const { data: centresData, error } = await supabase
          .from('erp_mgmt_structure')
          .select('cost_centre, entity_id, entity_name');

        if (error) {
          console.error('Supabase error fetching cost centres:', error);
          toast.error(`Failed to fetch cost centres: ${error.message}`);
          throw error;
        }

        return centresData || [];
      } catch (err) {
        console.error('Error in cost centre fetch:', err);
        toast.error('Failed to fetch cost centres');
        throw err;
      }
    },
    staleTime: 0
  });

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCostCentre = event.target.value;
    if (context?.updateRowData && selectedCostCentre) {
      const entityData = costCentres?.find(cc => cc.cost_centre === selectedCostCentre);
      if (entityData) {
        context.updateRowData(node.rowIndex, {
          cost_centre: selectedCostCentre,
          entity_id: entityData.entity_id,
          entity_name: entityData.entity_name
        });
      }
    }
  };

  // Filter cost centres if entity is selected
  const filteredCostCentres = data.entity_id 
    ? costCentres?.filter(cc => cc.entity_id === data.entity_id)
    : costCentres;

  if (error) {
    console.error('Cost centre query error:', error);
    toast.error('Error loading cost centres');
  }

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value="">Select Cost Centre</option>
        {(filteredCostCentres || []).map((cc: any) => (
          <option key={cc.cost_centre} value={cc.cost_centre}>
            {cc.cost_centre}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
      {isLoading && <span className="absolute right-8 top-1/2 transform -translate-y-1/2">Loading...</span>}
    </div>
  );
};
