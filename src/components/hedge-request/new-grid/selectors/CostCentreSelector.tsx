
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface CostCentreSelectorProps {
  value: string;
  data: any;
  node: any;
  field: string;
  context?: {
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

export const CostCentreSelector = ({ value, data, node, field, context }: CostCentreSelectorProps) => {
  const [lastProcessedEntityId, setLastProcessedEntityId] = useState<string | null>(null);

  const { data: costCentres, error } = useQuery({
    queryKey: ['cost-centres', data.entity_id],
    queryFn: async () => {
      if (!data.entity_id) return [];
      
      try {
        const { data: centresData, error } = await supabase
          .from('erp_mgmt_structure')
          .select('cost_centre')
          .eq('entity_id', data.entity_id.trim());

        if (error) {
          console.error('Supabase error fetching cost centres:', error);
          toast.error(`Failed to fetch cost centres: ${error.message}`);
          throw error;
        }

        if (!centresData || !Array.isArray(centresData)) {
          return [];
        }

        const validCentres = centresData
          .map(item => item.cost_centre)
          .filter(Boolean)
          .sort();

        return [...new Set(validCentres)];
      } catch (err) {
        console.error('Error in cost centre fetch:', err);
        toast.error('Failed to fetch cost centres');
        throw err;
      }
    },
    enabled: !!data.entity_id
  });

  useEffect(() => {
    if (data.entity_id && data.entity_id !== lastProcessedEntityId && costCentres) {
      console.log('Processing entity change:', {
        entityId: data.entity_id,
        costCentresCount: costCentres.length,
        currentValue: value
      });

      setLastProcessedEntityId(data.entity_id);

      if (costCentres.length === 1) {
        // Only auto-select if there's exactly one cost centre
        context?.updateRowData?.(node.rowIndex, {
          cost_centre: costCentres[0]
        });
      } else if (costCentres.length > 1) {
        // Clear the cost centre if there are multiple options
        context?.updateRowData?.(node.rowIndex, {
          cost_centre: ''
        });
      }
    }
  }, [data.entity_id, costCentres, lastProcessedEntityId, context, node.rowIndex, value]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (context?.updateRowData) {
      context.updateRowData(node.rowIndex, {
        cost_centre: event.target.value
      });
    }
  };

  if (error) {
    toast.error('Error loading cost centres');
  }

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
