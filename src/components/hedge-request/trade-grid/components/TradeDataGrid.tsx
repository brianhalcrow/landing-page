import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TradeDataGridProps {
  draftId: number;
  rates?: Map<string, number>;
}

const TradeDataGrid = ({ draftId, rates }: TradeDataGridProps) => {
  const emptyRow: HedgeRequestDraftTrade = {
    draft_id: draftId.toString(),
    base_currency: '',
    quote_currency: '',
    currency_pair: '',
    trade_date: '',
    settlement_date: '',
    buy_sell: 'BUY',
    buy_sell_currency_code: '',
    buy_sell_amount: 0
  };

  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([emptyRow]);
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

      if (!data?.length) {
        console.log('No trades found, using empty row');
        return [emptyRow];
      }

      return data.map(trade => ({
        ...trade,
        trade_date: trade.trade_date || '',
        settlement_date: trade.settlement_date || '',
        buy_sell: trade.buy_sell || 'BUY'
      })) as HedgeRequestDraftTrade[];
    }
  });

  useEffect(() => {
    if (trades) {
      setRowData(trades);
    }
  }, [trades]);

  if (error) {
    console.error('Query error:', error);
    return <div>Error loading trades. Please try again.</div>;
  }

  return (
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
          params.api.setFocusedCell(0, 'base_currency');
        }}
        onCellValueChanged={(event) => {
          console.log('Cell value changed:', event);
          if (event.column.getColId() === 'base_currency' || event.column.getColId() === 'quote_currency') {
            const rowNode = event.node;
            const baseCurrency = rowNode.data.base_currency;
            const quoteCurrency = rowNode.data.quote_currency;
            
            if (baseCurrency && quoteCurrency) {
              const currencyPair = `${baseCurrency}/${quoteCurrency}`;
              rowNode.setDataValue('currency_pair', currencyPair);
              
              if (rates?.has(currencyPair)) {
                const rate = rates.get(currencyPair);
                console.log(`Setting rate for ${currencyPair}:`, rate);
                rowNode.setDataValue('rate', rate);
              }
            }
          }
        }}
      />
    </div>
  );
};

export default TradeDataGrid;