
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
      const isSwap = currentRow.instrument?.toLowerCase() === 'swap';
      
      // Update the current row
      newData[rowIndex] = {
        ...currentRow,
        ...updates
      };

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

      // Handle SWAP-specific logic for other updates
      if (isSwap) {
        // If this is the first row or there's no second row yet
        if (rowIndex === newData.length - 1) {
          console.log('Adding new row for SWAP second leg');
          // Add a new row with copied values
          newData.push({
            ...defaultRow,
            entity_id: newData[rowIndex].entity_id,
            entity_name: newData[rowIndex].entity_name,
            strategy_name: newData[rowIndex].strategy_name,
            instrument: newData[rowIndex].instrument,
            counterparty_name: newData[rowIndex].counterparty_name,
            cost_centre: newData[rowIndex].cost_centre,
            // Mirror currencies if they exist
            buy_currency: newData[rowIndex].sell_currency,
            sell_currency: newData[rowIndex].buy_currency
          });
        } else {
          console.log('Updating existing second leg row');
          // Update the next row with the same values
          const existingNextRow = newData[rowIndex + 1];
          newData[rowIndex + 1] = {
            ...existingNextRow,
            entity_id: newData[rowIndex].entity_id,
            entity_name: newData[rowIndex].entity_name,
            strategy_name: newData[rowIndex].strategy_name,
            instrument: newData[rowIndex].instrument,
            counterparty_name: updates.counterparty_name || newData[rowIndex].counterparty_name,
            cost_centre: updates.cost_centre || newData[rowIndex].cost_centre
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
