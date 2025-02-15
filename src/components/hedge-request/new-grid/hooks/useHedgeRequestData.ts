
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
  cost_centre: ""
};

export const useHedgeRequestData = () => {
  const [rowData, setRowData] = useState<HedgeRequestRow[]>([defaultRow]);

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
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true
  });

  const updateRowData = (rowIndex: number, updates: Partial<HedgeRequestRow>) => {
    console.log('Updating row data:', { rowIndex, updates });
    
    setRowData(currentRows => {
      const newData = [...currentRows];
      const currentRow = newData[rowIndex];
      
      // Calculate the final state after updates
      const updatedRow = {
        ...currentRow,
        ...updates
      };
      
      const isSwap = (updates.instrument?.toLowerCase() === 'swap') || (currentRow.instrument?.toLowerCase() === 'swap');
      const isNewSwap = updates.instrument?.toLowerCase() === 'swap' && currentRow.instrument?.toLowerCase() !== 'swap';
      
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
          if (newData[nextRowIndex]) {
            newData[nextRowIndex] = {
              ...newData[nextRowIndex],
              buy_currency: updatedRow.sell_currency,
              sell_currency: updatedRow.buy_currency
            };
          }
        }
        // For second leg, update first leg's currencies
        else {
          const prevRowIndex = rowIndex - 1;
          if (newData[prevRowIndex]) {
            newData[prevRowIndex] = {
              ...newData[prevRowIndex],
              buy_currency: updatedRow.sell_currency,
              sell_currency: updatedRow.buy_currency
            };
          }
        }
      }

      // If this is an amount update for a swap
      if (isSwap && (updates.buy_amount !== undefined || updates.sell_amount !== undefined)) {
        // For first leg, update second leg's amounts
        if (rowIndex % 2 === 0) {
          const nextRowIndex = rowIndex + 1;
          if (newData[nextRowIndex]) {
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
          if (newData[prevRowIndex]) {
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
        newData.push({
          ...defaultRow,
          entity_id: updatedRow.entity_id,
          entity_name: updatedRow.entity_name,
          strategy_name: updatedRow.strategy_name,
          instrument: updatedRow.instrument,
          counterparty_name: updatedRow.counterparty_name,
          cost_centre: updatedRow.cost_centre,
          buy_currency: updatedRow.sell_currency,
          sell_currency: updatedRow.buy_currency
        });
      } else if (isSwap && rowIndex % 2 === 0) {
        // Update the second leg row with any changes from the first leg
        const existingNextRow = newData[rowIndex + 1];
        if (existingNextRow) {
          newData[rowIndex + 1] = {
            ...existingNextRow,
            entity_id: updatedRow.entity_id,
            entity_name: updatedRow.entity_name,
            strategy_name: updatedRow.strategy_name,
            instrument: updatedRow.instrument,
            counterparty_name: updates.counterparty_name || updatedRow.counterparty_name,
            cost_centre: updates.cost_centre || updatedRow.cost_centre,
          };
        }
      }

      return newData;
    });
  };

  const addNewRow = () => {
    setRowData([...rowData, { ...defaultRow }]);
  };

  return {
    rowData,
    validConfigs,
    addNewRow,
    updateRowData
  };
};
