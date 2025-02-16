
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

      console.log('Fetched configurations:', data);
      return (data as any[]).map(config => ({
        ...config,
        strategy_description: config.strategy_name
      })) as ValidHedgeConfig[];
    }
  });

  const updateRowData = (rowIndex: number, updates: Partial<HedgeRequestRow>) => {
    if (rowIndex < 0 || !updates) {
      console.error('Invalid row index or updates:', { rowIndex, updates });
      return;
    }

    console.log('Updating row data:', { rowIndex, updates });
    
    setRowData(currentRows => {
      const newData = [...currentRows];
      const currentRow = newData[rowIndex] || { ...defaultRow };
      
      // Calculate the final state after updates
      const updatedRow = {
        ...currentRow,
        ...updates
      };
      
      // Safely check if this is a swap
      const isSwap = (
        (updates.instrument || currentRow.instrument || '')
        .toLowerCase() === 'swap'
      );
      
      const isNewSwap = (
        updates.instrument?.toLowerCase() === 'swap' && 
        (currentRow.instrument || '').toLowerCase() !== 'swap'
      );
      
      // Handle amount validation for SWAP trades
      if (isSwap && (updates.buy_amount !== undefined || updates.sell_amount !== undefined)) {
        // For first leg
        if (rowIndex % 2 === 0) {
          // Calculate the final state after this update
          const finalBuyAmount = updates.buy_amount ?? currentRow.buy_amount;
          const finalSellAmount = updates.sell_amount ?? currentRow.sell_amount;
          
          // Only validate if we would end up with both amounts
          if (finalBuyAmount !== null && finalSellAmount !== null) {
            toast.error('First leg can only have either buy or sell amount');
            return newData;
          }
        }
      }

      // Update the current row
      newData[rowIndex] = updatedRow;

      // If this is a currency update for a swap
      if (isSwap && (updates.buy_currency !== undefined || updates.sell_currency !== undefined)) {
        // For first leg, update second leg's currencies
        if (rowIndex % 2 === 0) {
          const nextRowIndex = rowIndex + 1;
          if (nextRowIndex < newData.length) {
            newData[nextRowIndex] = {
              ...newData[nextRowIndex],
              buy_currency: updatedRow.sell_currency || '',
              sell_currency: updatedRow.buy_currency || ''
            };
          }
        }
        // For second leg, update first leg's currencies
        else {
          const prevRowIndex = rowIndex - 1;
          if (prevRowIndex >= 0) {
            newData[prevRowIndex] = {
              ...newData[prevRowIndex],
              buy_currency: updatedRow.sell_currency || '',
              sell_currency: updatedRow.buy_currency || ''
            };
          }
        }
      }

      // If this is an amount update for a swap
      if (isSwap && (updates.buy_amount !== undefined || updates.sell_amount !== undefined)) {
        // For first leg, update second leg's amounts
        if (rowIndex % 2 === 0) {
          const nextRowIndex = rowIndex + 1;
          if (nextRowIndex < newData.length) {
            newData[nextRowIndex] = {
              ...newData[nextRowIndex],
              buy_amount: updatedRow.sell_amount,
              sell_amount: updatedRow.buy_amount
            };
          }
        }
        // For second leg, update first leg's amounts
        else {
          const prevRowIndex = rowIndex - 1;
          if (prevRowIndex >= 0) {
            newData[prevRowIndex] = {
              ...newData[prevRowIndex],
              buy_amount: updatedRow.sell_amount,
              sell_amount: updatedRow.buy_amount
            };
          }
        }
      }

      // Only add a new row if this is the first time the instrument is being set to swap
      if (isNewSwap && rowIndex === newData.length - 1) {
        console.log('Adding new row for SWAP second leg');
        const secondLegId = crypto.randomUUID();
        const swapId = crypto.randomUUID();
        
        // Update first leg with swap information
        newData[rowIndex] = {
          ...updatedRow,
          rowId: crypto.randomUUID(),
          swapId,
          swapLeg: 1
        };
        
        // Add second leg
        newData.push({
          ...defaultRow,
          rowId: secondLegId,
          swapId,
          swapLeg: 2,
          entity_id: updatedRow.entity_id || '',
          entity_name: updatedRow.entity_name || '',
          strategy_name: updatedRow.strategy_name || '',
          instrument: updatedRow.instrument || '',
          counterparty_name: updatedRow.counterparty_name || '',
          cost_centre: updatedRow.cost_centre || '',
          buy_currency: updatedRow.sell_currency || '',
          sell_currency: updatedRow.buy_currency || ''
        });
      }

      return newData;
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
    clearRowData
  };
};
