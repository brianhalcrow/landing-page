import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { CellValueChangedEvent } from 'ag-grid-community';
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
    buy_amount: 0,
    sell_amount: 0
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
        buy_amount: trade.buy_amount || 0,
        sell_amount: trade.sell_amount || 0
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

  const handleCellValueChanged = (event: CellValueChangedEvent) => {
    try {
      console.log('Cell value changed:', event);
      
      // Safely check if column exists and get its ID
      const column = event.column;
      if (!column) {
        console.error('No column found in event');
        return;
      }
      
      const colId = column.getColId();
      if (!colId) {
        console.error('No column ID found');
        return;
      }

      // Only process currency-related changes
      if (colId === 'base_currency' || colId === 'quote_currency') {
        const rowNode = event.node;
        if (!rowNode || !rowNode.data) {
          console.error('No row node or data found');
          return;
        }

        const { base_currency, quote_currency } = rowNode.data;
        
        if (base_currency && quote_currency) {
          const currencyPair = `${base_currency}/${quote_currency}`;
          console.log('Setting currency pair:', currencyPair);
          
          // Safely set the currency pair
          try {
            rowNode.setDataValue('currency_pair', currencyPair);
            
            // Set rate if available
            if (rates?.has(currencyPair)) {
              const rate = rates.get(currencyPair);
              console.log(`Setting rate for ${currencyPair}:`, rate);
              rowNode.setDataValue('rate', rate);
            }
          } catch (error) {
            console.error('Error updating row values:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error in handleCellValueChanged:', error);
    }
  };

  return (
    <div className="ag-theme-alpine h-[400px] w-full">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          flex: 1,
          minWidth: 100,
          sortable: true,
          filter: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
        }}
        onGridReady={(params) => {
          console.log('Grid ready');
          params.api.setFocusedCell(0, 'base_currency');
        }}
        onCellValueChanged={handleCellValueChanged}
      />
    </div>
  );
};

export default TradeDataGrid;