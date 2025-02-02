import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import TradeGridToolbar from './TradeGridToolbar';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { format } from 'date-fns';

interface TradeDataGridProps {
  draftId: number;
}

const TradeDataGrid = ({ draftId }: TradeDataGridProps) => {
  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([]);
  const columnDefs = useTradeColumns();

  const { data: trades } = useQuery({
    queryKey: ['draft-trades', draftId],
    queryFn: async () => {
      console.log('Fetching trades for draft:', draftId);
      const { data, error } = await supabase
        .from('hedge_request_draft_trades')
        .select('*')
        .eq('draft_id', draftId.toString());

      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }

      // Format dates from DB (YYYY-MM-DD) to display format (DD/MM/YYYY)
      return data?.map(trade => ({
        ...trade,
        trade_date: trade.trade_date ? format(new Date(trade.trade_date), 'dd/MM/yyyy') : '',
        settlement_date: trade.settlement_date ? format(new Date(trade.settlement_date), 'dd/MM/yyyy') : ''
      })) as HedgeRequestDraftTrade[];
    }
  });

  return (
    <div className="space-y-4">
      <TradeGridToolbar 
        draftId={draftId} 
        rowData={rowData} 
        setRowData={setRowData} 
      />
      
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