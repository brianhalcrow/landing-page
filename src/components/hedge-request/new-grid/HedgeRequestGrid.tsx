
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AgGridReact } from 'ag-grid-react';
import { GridStyles } from '../grid/components/GridStyles';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { createColumnDefs } from './config/columnDefs';
import type { HedgeRequestRow, ValidHedgeConfig } from "./types/hedgeRequest.types";

const HedgeRequestGrid = () => {
  const [rowData, setRowData] = useState<HedgeRequestRow[]>([{
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
  }]);

  // Fetch valid configurations
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

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={rowData}
          columnDefs={createColumnDefs()}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false
          }}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          onCellValueChanged={(event) => {
            const newData = [...rowData];
            newData[event.rowIndex] = { 
              ...newData[event.rowIndex], 
              [event.colDef.field]: event.newValue 
            };
            setRowData(newData);
          }}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => setRowData([...rowData, {
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
          }])}
        >
          Add Row
        </Button>
        <Button onClick={handleSave}>
          Save Trade Requests
        </Button>
      </div>
    </div>
  );
};

export default HedgeRequestGrid;
