import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { HedgeRequestRow, ValidHedgeConfig } from "../types/hedgeRequest.types";

const defaultRow: HedgeRequestRow = {
  entity_id: "",
  entity_name: "",
  strategy_name: "",
  instrument: "",
  counterparty_name: "",
  buy_currency: "",
  buy_amount: null,
  sell_currency: "",
  sell_amount: null,
  trade_date: null,
  settlement_date: null,
  cost_centre: "",
  rowId: crypto.randomUUID()
};

export const useHedgeRequestData = () => {
  const [rowData, setRowData] = useState<HedgeRequestRow[]>([{ ...defaultRow }]);

  const { data: validConfigs } = useQuery({
    queryKey: ['valid-hedge-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_hedge_request_config')
        .select(`
          entity_id,
          entity_name,
          strategy_id,
          strategy_name,
          instrument,
          counterparty_name,
          functional_currency
        `);
      
      if (error) {
        console.error('Error fetching valid configurations:', error);
        toast.error('Failed to fetch valid configurations');
        return [];
      }

      return (data as any[]).map(config => ({
        ...config,
        strategy_description: config.strategy_name
      })) as ValidHedgeConfig[];
    }
  });

  const removeRow = (rowToRemove: HedgeRequestRow) => {
    console.log('Removing row:', rowToRemove);
    setRowData(currentRows => {
      const filteredRows = currentRows.filter(row => row.rowId !== rowToRemove.rowId);
      return filteredRows.length > 0 ? filteredRows : [{ ...defaultRow }];
    });
  };

  const updateRowData = (rowIndex: number, updates: Partial<HedgeRequestRow>) => {
    if (rowIndex < 0) {
      console.error('Invalid row index:', rowIndex);
      return;
    }

    console.log('Updating row data:', { rowIndex, updates });
    
    setRowData(currentRows => {
      const newRows = [...currentRows];
      const currentRow = newRows[rowIndex];
      
      if (!currentRow) {
        console.error('Row not found at index:', rowIndex);
        return currentRows;
      }

      const updatedRow = {
        ...currentRow,
        ...updates,
        rowId: currentRow.rowId // Ensure rowId remains unchanged
      };
      
      newRows[rowIndex] = updatedRow;

      // Handle swap instrument selection
      if (updates.instrument?.toLowerCase() === 'swap' && currentRow.instrument?.toLowerCase() !== 'swap') {
        const swapId = crypto.randomUUID();
        // Update the current row with swap details
        newRows[rowIndex] = {
          ...updatedRow,
          swap_id: swapId,
          swap_leg: 1
        };

        // Create and add the second leg
        const secondLeg: HedgeRequestRow = {
          ...updatedRow,
          rowId: crypto.randomUUID(),
          swap_id: swapId,
          swap_leg: 2,
          // Clear amounts as they will be different
          buy_amount: null,
          sell_amount: null
        };
        newRows.splice(rowIndex + 1, 0, secondLeg);
        
        console.log('Created swap pair with ID:', swapId);
      } else if (updatedRow.instrument?.toLowerCase() !== 'swap' && currentRow.instrument?.toLowerCase() === 'swap') {
        // If changing from swap to non-swap, remove the paired row
        const swapId = currentRow.swap_id;
        if (swapId) {
          return currentRows.filter(row => row.swap_id !== swapId);
        }
      }

      // Update paired swap row if applicable
      const isSwap = updatedRow.instrument?.toLowerCase() === 'swap';
      if (isSwap && updatedRow.swap_id) {
        // Update the paired swap row if it exists
        const pairedIndex = newRows.findIndex(
          row => row.swap_id === updatedRow.swap_id && row.rowId !== updatedRow.rowId
        );
        
        if (pairedIndex >= 0) {
          newRows[pairedIndex] = {
            ...newRows[pairedIndex],
            entity_id: updatedRow.entity_id,
            entity_name: updatedRow.entity_name,
            strategy_name: updatedRow.strategy_name,
            instrument: updatedRow.instrument,
            counterparty_name: updatedRow.counterparty_name,
            cost_centre: updatedRow.cost_centre,
          };
        }
      }

      return newRows;
    });
  };

  const addNewRow = () => {
    setRowData(currentRows => [...currentRows, { ...defaultRow, rowId: crypto.randomUUID() }]);
  };

  const clearRowData = () => {
    setRowData([{ ...defaultRow, rowId: crypto.randomUUID() }]);
  };

  return {
    rowData,
    validConfigs,
    addNewRow,
    updateRowData,
    clearRowData,
    removeRow
  };
};
