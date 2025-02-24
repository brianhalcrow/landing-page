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

  const removeRow = (rowToRemove: HedgeRequestRow) => {
    console.log('Removing row:', rowToRemove);
    setRowData(currentRows => {
      if (rowToRemove.instrument?.toLowerCase() === 'swap' && rowToRemove.swap_id) {
        console.log('Removing swap pair with ID:', rowToRemove.swap_id);
        const filteredRows = currentRows.filter(row => row.swap_id !== rowToRemove.swap_id);
        console.log('Rows after swap removal:', filteredRows);
        return filteredRows;
      }
      
      console.log('Removing single row with ID:', rowToRemove.rowId);
      const filteredRows = currentRows.filter(row => row.rowId !== rowToRemove.rowId);
      console.log('Rows after single removal:', filteredRows);
      
      if (filteredRows.length === 0) {
        return [{ ...defaultRow, rowId: crypto.randomUUID() }];
      }
      
      return filteredRows;
    });
  };

  const updateRowData = (rowIndex: number, updates: Partial<HedgeRequestRow>) => {
    if (rowIndex < 0 || !updates) {
      console.error('Invalid row index or updates:', { rowIndex, updates });
      return;
    }

    console.log('Updating row data:', { rowIndex, updates });
    
    setRowData(currentRows => {
      const newData = [...currentRows];
      const currentRow = newData[rowIndex] || { ...defaultRow };
      
      const updatedRow = {
        ...currentRow,
        ...updates
      };
      
      const isSwap = (
        (updates.instrument || currentRow.instrument || '')
        .toLowerCase() === 'swap'
      );
      
      const isNewSwap = (
        updates.instrument?.toLowerCase() === 'swap' && 
        (currentRow.instrument || '').toLowerCase() !== 'swap'
      );
      
      if (isSwap && (updates.buy_amount !== undefined || updates.sell_amount !== undefined)) {
        if (rowIndex % 2 === 0) {
          const finalBuyAmount = updates.buy_amount ?? currentRow.buy_amount;
          const finalSellAmount = updates.sell_amount ?? currentRow.sell_amount;
          
          if (finalBuyAmount !== null && finalSellAmount !== null) {
            toast.error('First leg can only have either buy or sell amount');
            return newData;
          }
        }
      }

      newData[rowIndex] = updatedRow;

      if (isSwap) {
        if (rowIndex % 2 === 0) {
          const nextRowIndex = rowIndex + 1;
          if (nextRowIndex < newData.length) {
            newData[nextRowIndex] = {
              ...newData[nextRowIndex],
              buy_currency: updatedRow.sell_currency || '',
              sell_currency: updatedRow.buy_currency || '',
              entity_id: updatedRow.entity_id || '',
              entity_name: updatedRow.entity_name || '',
              strategy_name: updatedRow.strategy_name || '',
              instrument: updatedRow.instrument || '',
              counterparty_name: updatedRow.counterparty_name || '',
              cost_centre: updatedRow.cost_centre || '',
            };
            if (updates.buy_amount !== undefined || updates.sell_amount !== undefined) {
              newData[nextRowIndex].buy_amount = updatedRow.sell_amount;
              newData[nextRowIndex].sell_amount = updatedRow.buy_amount;
            }
          }
        } else {
          const prevRowIndex = rowIndex - 1;
          if (prevRowIndex >= 0) {
            newData[prevRowIndex] = {
              ...newData[prevRowIndex],
              buy_currency: updatedRow.sell_currency || '',
              sell_currency: updatedRow.buy_currency || '',
              entity_id: updatedRow.entity_id || '',
              entity_name: updatedRow.entity_name || '',
              strategy_name: updatedRow.strategy_name || '',
              instrument: updatedRow.instrument || '',
              counterparty_name: updatedRow.counterparty_name || '',
              cost_centre: updatedRow.cost_centre || '',
            };
            if (updates.buy_amount !== undefined || updates.sell_amount !== undefined) {
              newData[prevRowIndex].buy_amount = updatedRow.sell_amount;
              newData[prevRowIndex].sell_amount = updatedRow.buy_amount;
            }
          }
        }
      }

      if (isNewSwap && rowIndex === newData.length - 1) {
        console.log('Adding new row for SWAP second leg');
        const secondLegId = crypto.randomUUID();
        const swap_id = crypto.randomUUID();
        
        newData[rowIndex] = {
          ...updatedRow,
          rowId: crypto.randomUUID(),
          swap_id,
          swap_leg: 1
        };
        
        newData.push({
          ...defaultRow,
          rowId: secondLegId,
          swap_id,
          swap_leg: 2,
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
    clearRowData,
    removeRow
  };
};
