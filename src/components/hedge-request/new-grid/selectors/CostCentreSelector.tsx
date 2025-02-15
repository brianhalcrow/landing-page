
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [lastAttemptedEntityId, setLastAttemptedEntityId] = useState<string | null>(null);

  // Main cost centres query
  const { data: costCentres, isLoading, error } = useQuery({
    queryKey: ['cost-centres', data.entity_id],
    queryFn: async () => {
      console.log('Fetching cost centres for entity:', data.entity_id);
      
      if (!data.entity_id) {
        console.warn('No entity_id provided for cost centre fetch');
        return [];
      }
      
      try {
        // Now fetch the cost centres from erp_mgmt_structure
        const { data: centresData, error } = await supabase
          .from('erp_mgmt_structure')
          .select('cost_centre')
          .eq('entity_id', data.entity_id.trim());

        if (error) {
          console.error('Supabase error fetching cost centres:', error);
          toast.error(`Failed to fetch cost centres: ${error.message}`);
          throw error;
        }

        console.log('Raw cost centre data:', centresData);
        
        if (!centresData || !Array.isArray(centresData)) {
          console.warn('Unexpected data format from Supabase:', centresData);
          return [];
        }

        // Ensure we remove any null or undefined values and sort the array
        const validCentres = centresData
          .map(item => item.cost_centre)
          .filter(Boolean)
          .sort();

        console.log('Processed cost centres:', validCentres);
        return [...new Set(validCentres)];
      } catch (err) {
        console.error('Error in cost centre fetch:', err);
        toast.error('Failed to fetch cost centres');
        throw err;
      }
    },
    enabled: !!data.entity_id,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000
  });

  // Auto-selection effect
  useEffect(() => {
    const shouldAutoSelect = 
      !isLoading && 
      costCentres?.length === 1 && 
      !value && 
      context?.updateRowData && 
      !hasAttemptedAutoSelect.current &&
      data.entity_id && 
      data.entity_id !== lastAttemptedEntityId;

    console.log('Auto-select evaluation:', {
      isLoading,
      costCentresLength: costCentres?.length,
      currentValue: value,
      hasContext: !!context?.updateRowData,
      hasAttempted: hasAttemptedAutoSelect.current,
      entityId: data.entity_id,
      lastAttemptedEntityId,
      shouldAutoSelect
    });

    if (shouldAutoSelect) {
      console.log('Attempting to auto-select cost centre:', costCentres[0]);
      hasAttemptedAutoSelect.current = true;
      setLastAttemptedEntityId(data.entity_id);

      requestAnimationFrame(() => {
        context.updateRowData(node.rowIndex, {
          cost_centre: costCentres[0]
        });
      });
    }
  }, [costCentres, value, context, node.rowIndex, isLoading, data.entity_id, lastAttemptedEntityId]);

  // Reset auto-select when entity changes
  useEffect(() => {
    if (data.entity_id !== lastAttemptedEntityId) {
      console.log('Resetting auto-select for new entity:', data.entity_id);
      hasAttemptedAutoSelect.current = false;
    }
  }, [data.entity_id, lastAttemptedEntityId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (context?.updateRowData) {
      const newValue = event.target.value;
      console.log('Manual cost centre selection:', {
        newValue,
        rowIndex: node.rowIndex
      });
      context.updateRowData(node.rowIndex, {
        cost_centre: newValue
      });
    } else {
      console.warn('No updateRowData function available in context');
    }
  };

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
        disabled={!data.entity_id || isLoading}
      >
        <option value="">Select Cost Centre</option>
        {(costCentres || []).map((cc: string) => (
          <option key={cc} value={cc}>{cc}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
      {isLoading && <span className="absolute right-8 top-1/2 transform -translate-y-1/2">Loading...</span>}
    </div>
  );
};
