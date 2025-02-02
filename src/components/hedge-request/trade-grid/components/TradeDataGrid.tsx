import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TradeDataGridProps {
  draftId: number;
}

const TradeDataGrid = ({ draftId }: TradeDataGridProps) => {
  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([]);

  const { data: trades } = useQuery({
    queryKey: ['draft-trades', draftId],
    queryFn: async () => {
      console.log('Fetching trades for draft:', draftId);
      const { data, error } = await supabase
        .from('hedge_request_draft_trades')
        .select('*')
        .eq('draft_id', draftId.toString()); // Convert number to string here

      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }

      return data as HedgeRequestDraftTrade[];
    }
  });

  const columnDefs: ColDef[] = [
    { field: 'base_currency', headerName: 'Base Currency', editable: true },
    { field: 'quote_currency', headerName: 'Quote Currency', editable: true },
    { field: 'currency_pair', headerName: 'Currency Pair', editable: true },
    { field: 'trade_date', headerName: 'Trade Date', editable: true },
    { field: 'settlement_date', headerName: 'Settlement Date', editable: true },
    { 
      field: 'buy_sell', 
      headerName: 'Buy/Sell', 
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['BUY', 'SELL']
      }
    },
    { field: 'buy_sell_currency_code', headerName: 'Currency', editable: true },
    { field: 'buy_sell_amount', headerName: 'Amount', editable: true, type: 'numericColumn' }
  ];

  const handleAddRow = () => {
    const newRow: HedgeRequestDraftTrade = {
      draft_id: draftId.toString(), // Convert number to string here as well
      base_currency: '',
      quote_currency: '',
      currency_pair: '',
      trade_date: '',
      settlement_date: '',
      buy_sell: 'BUY',
      buy_sell_currency_code: '',
      buy_sell_amount: 0
    };
    setRowData([...rowData, newRow]);
  };

  const handleSaveTrades = async () => {
    try {
      const { error } = await supabase
        .from('hedge_request_draft_trades')
        .insert(rowData);

      if (error) throw error;
      
      toast.success('Trades saved successfully');
    } catch (error) {
      console.error('Error saving trades:', error);
      toast.error('Failed to save trades');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={handleAddRow} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Trade
        </Button>
        <Button onClick={handleSaveTrades} size="sm">
          Save Trades
        </Button>
      </div>
      
      <div className="ag-theme-alpine h-[400px] w-full">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            sortable: true,
            filter: true
          }}
          onGridReady={(params) => {
            if (trades) {
              setRowData(trades);
            }
          }}
        />
      </div>
    </div>
  );
};

export default TradeDataGrid;