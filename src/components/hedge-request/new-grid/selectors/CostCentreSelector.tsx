
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";

interface CostCentreSelectorProps {
  value: string;
  data: any;
  node: any;
  context?: {
    updateRowData?: (rowIndex: number, updates: any) => void;
  };
}

export const CostCentreSelector = ({ value, data, node, context }: CostCentreSelectorProps) => {
  const hasAttemptedAutoSelect = useRef(false);

  const { data: costCentres, isLoading, error } = useQuery({
    queryKey: ['cost-centres', data.entity_id],
    queryFn: async () => {
      console.log('Fetching cost centres for entity:', data.entity_id);
      
      if (!data.entity_id) {
        console.log('No entity_id provided, returning empty array');
        return [];
      }
      
      const { data: centresData, error } = await supabase
        .from('management_structure')
        .select('cost_centre')
        .eq('entity_id', data.entity_id);

      if (error) {
        console.error('Error fetching cost centres:', error);
        toast.error('Failed to fetch cost centres');
        return [];
      }

      console.log('Raw cost centre data:', centresData);

      // Ensure we remove any null or undefined values and sort the array
      const validCentres = centresData
        .map(item => item.cost_centre)
        .filter(Boolean)
        .sort();

      console.log('Processed cost centres:', validCentres);
      return [...new Set(validCentres)];
    },
    enabled: !!data.entity_id,
    staleTime: 0,
    retry: 2,
    retryDelay: 1000
  });

  useEffect(() => {
    if (
      !isLoading && 
      costCentres?.length === 1 && 
      !value && 
      context?.updateRowData && 
      !hasAttemptedAutoSelect.current &&
      data.entity_id // Ensure we have an entity_id
    ) {
      console.log('Attempting to auto-select cost centre:', {
        costCentres,
        currentValue: value,
        entityId: data.entity_id,
        rowIndex: node.rowIndex
      });

      hasAttemptedAutoSelect.current = true;

      // Use requestAnimationFrame to ensure DOM updates have completed
      requestAnimationFrame(() => {
        context.updateRowData(node.rowIndex, {
          cost_centre: costCentres[0]
        });
        console.log('Auto-selected cost centre:', costCentres[0]);
      });
    }
  }, [costCentres, value, context, node.rowIndex, isLoading, data.entity_id]);

  // Reset the auto-select flag when the entity changes
  useEffect(() => {
    hasAttemptedAutoSelect.current = false;
  }, [data.entity_id]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (context?.updateRowData) {
      const newValue = event.target.value;
      console.log('Manual cost centre selection:', newValue);
      context.updateRowData(node.rowIndex, {
        cost_centre: newValue
      });
    }
  };

  if (error) {
    console.error('Cost centre query error:', error);
  }

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={handleChange}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
        disabled={!data.entity_id || isLoading}
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
