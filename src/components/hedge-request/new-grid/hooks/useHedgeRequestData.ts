
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { HedgeRequestRow, ValidHedgeConfig } from "../types/hedgeRequest.types";

const defaultRow: HedgeRequestRow = {
  entity_id: "",
  entity_name: "",
  strategy: "",
  instrument: "",
  counterparty: "",
  counterparty_name: "",
  buy_sell: "BUY",
  amount: 0,
  currency: "",
  trade_date: new Date().toISOString().split('T')[0],
  settlement_date: "",
  cost_centre: ""
};

export const useHedgeRequestData = () => {
  const [rowData, setRowData] = useState<HedgeRequestRow[]>([defaultRow]);

  const { data: validConfigs } = useQuery({
    queryKey: ['valid-hedge-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_valid_hedge_configurations')
        .select('*')
        .eq('is_assigned', true);
      
      if (error) throw error;
      return data as ValidHedgeConfig[];
    }
  });

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_requests')
        .insert(
          rowData.map(row => ({
            entity_id: row.entity_id,
            entity_name: row.entity_name,
            strategy: row.strategy,
            instrument: row.instrument,
            counterparty: row.counterparty,
            counterparty_name: row.counterparty_name,
            ccy_1: row.currency,
            ccy_1_amount: row.buy_sell === 'BUY' ? row.amount : null,
            ccy_2_amount: row.buy_sell === 'SELL' ? row.amount : null,
            trade_date: row.trade_date,
            settlement_date: row.settlement_date,
            cost_centre: row.cost_centre,
            created_at: new Date().toISOString()
          }))
        )
        .select();

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

  const updateRowData = (rowIndex: number, field: string, value: any) => {
    const newData = [...rowData];
    newData[rowIndex] = { 
      ...newData[rowIndex], 
      [field]: value 
    };
    setRowData(newData);
  };

  return {
    rowData,
    validConfigs,
    handleSave,
    addNewRow,
    updateRowData
  };
};
