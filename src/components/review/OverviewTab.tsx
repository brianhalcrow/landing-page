import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ColDef } from 'ag-grid-community';

interface TradeRegister {
  id: number;
  entity_name: string;
  currency_pair: string;
  instrument: string;
  strategy: string;
  deal_id: string;
  trade_date: string;
  settlement_date: string;
  counterparty: string;
  buy_sell: string;
  spot_rate: number;
  contract_rate: number;
  base_currency: string;
  base_currency_amount: number;
  quote_currency: string;
  quote_currency_amount: string;
  ticket_ref: string;
  entity_id: string;
  buy_sell_currency_code: string;
}

const OverviewTab = () => {
  const [trades, setTrades] = useState<TradeRegister[]>([]);
  const { toast } = useToast();

  const columnDefs: ColDef<TradeRegister>[] = [
    { field: 'entity_name', headerName: "Entity", flex: 1 },
    { field: 'currency_pair', headerName: "Currency Pair", width: 120 },
    { field: 'instrument', headerName: "Instrument", width: 120 },
    { field: 'strategy', headerName: "Strategy", width: 120 },
    { field: 'deal_id', headerName: "Deal ID", width: 120 },
    { field: 'trade_date', headerName: "Trade Date", width: 120 },
    { field: 'settlement_date', headerName: "Settlement Date", width: 140 },
    { field: 'counterparty', headerName: "Counterparty", width: 140 },
    { field: 'buy_sell', headerName: "Buy/Sell", width: 100 },
    { 
      field: 'spot_rate', 
      headerName: "Spot Rate", 
      width: 120,
      type: 'numericColumn'
    },
    { 
      field: 'contract_rate', 
      headerName: "Contract Rate", 
      width: 120,
      type: 'numericColumn'
    },
    { field: 'base_currency', headerName: "Base Currency", width: 120 },
    { 
      field: 'base_currency_amount', 
      headerName: "Base Amount", 
      width: 120,
      type: 'numericColumn'
    },
    { field: 'quote_currency', headerName: "Quote Currency", width: 120 },
    { field: 'quote_currency_amount', headerName: "Quote Amount", width: 120 },
    { field: 'ticket_ref', headerName: "Ticket Ref", width: 120 },
  ];

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const { data, error } = await supabase
          .from('pre_trade_sfx_trade_register')
          .select('*');

        if (error) {
          throw error;
        }

        setTrades(data || []);
      } catch (error) {
        console.error('Error fetching trades:', error);
        toast({
          title: "Error",
          description: "Failed to fetch trade data",
          variant: "destructive",
        });
      }
    };

    fetchTrades();
  }, [toast]);

  return (
    <div className="h-[600px] w-full ag-theme-alpine">
      <AgGridReact<TradeRegister>
        rowData={trades}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
        }}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default OverviewTab;