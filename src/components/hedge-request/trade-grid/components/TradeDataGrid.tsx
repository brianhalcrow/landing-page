import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import TradeGridToolbar from './TradeGridToolbar';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TradeDataGridProps {
  draftId: number;
  rates?: Map<string, number>;
}

const TradeDataGrid = ({ draftId, rates }: TradeDataGridProps) => {
  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([]);
  const columnDefs = useTradeColumns(rates);

  const { data: trades, error } = useQuery({
    queryKey: ['draft-trades', draftId],
    queryFn: async () => {
      console.log('Fetching trades for draft:', draftId);
      const { data, error } = await supabase
        .from('hedge_request_draft_trades')
        .select('*')
        .eq('draft_id', draftId.toString());

      if (error) {
        console.error('Error fetching trades:', error);
        toast.error('Error fetching trades');
        throw error;
      }

      if (!data) {
        console.log('No trades found');
        return [];
      }

      // Format dates from DB (YYYY-MM-DD) to display format (DD/MM/YYYY)
      return data.map(trade => ({
        ...trade,
        trade_date: trade.trade_date ? format(new Date(trade.trade_date), 'dd/MM/yyyy') : '',
        settlement_date: trade.settlement_date ? format(new Date(trade.settlement_date), 'dd/MM/yyyy') : ''
      })) as HedgeRequestDraftTrade[];
    }
  });

  if (error) {
    console.error('Query error:', error);
    return <div>Error loading trades. Please try again.</div>;
  }

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
            console.log('Grid ready');
            if (trades) {
              console.log('Setting initial row data:', trades);
              setRowData(trades);
            }
          }}
          onCellValueChanged={(event) => {
            console.log('Cell value changed:', event);
            // Update currency pair and rate when base or quote currency changes
            if (event.column.getColId() === 'base_currency' || event.column.getColId() === 'quote_currency') {
              const rowNode = event.node;
              const baseCurrency = rowNode.data.base_currency;
              const quoteCurrency = rowNode.data.quote_currency;
              
              if (baseCurrency && quoteCurrency) {
                const currencyPair = `${baseCurrency}/${quoteCurrency}`;
                rowNode.setDataValue('currency_pair', currencyPair);
                
                // Update rate if available
                if (rates?.has(currencyPair)) {
                  const rate = rates.get(currencyPair);
                  console.log(`Setting rate for ${currencyPair}:`, rate);
                  // You might want to store this rate in a separate column
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default TradeDataGrid;