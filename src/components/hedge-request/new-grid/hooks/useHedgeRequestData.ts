
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
      
      // First, create the updated row by merging current values with updates
      const updatedRow = {
        ...currentRow,
        ...updates
      };
      
      // Check if this is a swap instrument based on the updates or current instrument
      const isSwap = (updates.instrument?.toLowerCase() === 'swap') || (currentRow.instrument?.toLowerCase() === 'swap');
      const isNewSwap = updates.instrument?.toLowerCase() === 'swap' && currentRow.instrument?.toLowerCase() !== 'swap';
      console.log('Checking for SWAP:', { isSwap, isNewSwap, updateInstrument: updates.instrument, currentInstrument: currentRow.instrument });

      // Handle amount validation for SWAP trades
      if (isSwap && (updates.buy_amount !== undefined || updates.sell_amount !== undefined)) {
        // For first leg
        if (rowIndex % 2 === 0) {
          if (updates.buy_amount !== null && currentRow.sell_amount !== null) {
            toast.error('First leg can only have either buy or sell amount');
            return newData;
          }
          if (updates.sell_amount !== null && currentRow.buy_amount !== null) {
            toast.error('First leg can only have either buy or sell amount');
            return newData;
          }
        }
        // For second leg
        else {
          const firstLeg = newData[rowIndex - 1];
          // If first leg has buy amount, second leg must have sell amount
          if (firstLeg.buy_amount !== null && updates.sell_amount === null) {
            toast.error('Second leg must have sell amount when first leg has buy amount');
            return newData;
          }
          // If first leg has sell amount, second leg must have buy amount
          if (firstLeg.sell_amount !== null && updates.buy_amount === null) {
            toast.error('Second leg must have buy amount when first leg has sell amount');
            return newData;
          }
        }
      }

      // Update the current row
      newData[rowIndex] = updatedRow;

      // Handle currency mirroring for swap legs if currencies are being updated
      if (isSwap && (updates.buy_currency || updates.sell_currency)) {
        const nextRow = newData[rowIndex + 1];
        if (nextRow) {
          if (updates.buy_currency) {
            newData[rowIndex + 1] = {
              ...nextRow,
              sell_currency: updates.buy_currency
            };
          }
          if (updates.sell_currency) {
            newData[rowIndex + 1] = {
              ...nextRow,
              buy_currency: updates.sell_currency
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
          // Mirror currencies if they exist
          buy_currency: updatedRow.sell_currency,
          sell_currency: updatedRow.buy_currency
        });
      } else if (isSwap && rowIndex % 2 === 0) {
        // Just update the second leg row with any changes from the first leg
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

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_requests')
        .insert(
          rowData.map(row => ({
            entity_id: row.entity_id,
            entity_name: row.entity_name,
            strategy_name: row.strategy_name,
            instrument: row.instrument,
            counterparty_name: row.counterparty_name,
            ccy_1: row.buy_currency,
            ccy_1_amount: row.buy_amount,
            ccy_2: row.sell_currency,
            ccy_2_amount: row.sell_amount,
            trade_date: row.trade_date,
            settlement_date: row.settlement_date,
            cost_centre: row.cost_centre,
            created_at: new Date().toISOString()
          }))
        );

      if (error) throw error;
      toast.success('Trade request saved successfully');
    } catch (error) {
      console.error('Error saving trade request:', error);
      toast.error('Failed to save trade request');
    }
  };

  const addNewRow = () => {
    setRowData([...rowData, { ...defaultRow }]);
  };

  return {
    rowData,
    validConfigs,
    handleSave,
    addNewRow,
    updateRowData
  };
};
