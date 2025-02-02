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
    buy_currency: '',
    sell_currency: '',
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

  const calculateAmounts = (
    rowNode: any,
    colId: string,
    value: number,
    rate?: number
  ) => {
    if (!rate) return;

    try {
      if (colId === 'buy_amount') {
        const sellAmount = value * rate;
        rowNode.setDataValue('sell_amount', sellAmount);
      } else {
        const buyAmount = value / rate;
        rowNode.setDataValue('buy_amount', buyAmount);
      }
    } catch (error) {
      console.error('Error calculating amounts:', error);
    }
  };

  const handleCellKeyDown = (event: any) => {
    try {
      const column = event.column;
      const colId = column.getColId();
      
      if (colId !== 'buy_amount' && colId !== 'sell_amount') return;

      const rowNode = event.node;
      if (!rowNode || !rowNode.data) return;

      const { buy_currency, sell_currency } = rowNode.data;
      if (!buy_currency || !sell_currency) return;

      const currencyPair = `${buy_currency}/${sell_currency}`;
      const rate = rates?.get(currencyPair);
      if (!rate) return;

      const currentValue = event.value?.toString() || '0';
      const newChar = event.event.key;
      
      if (!/^\d$/.test(newChar)) return;

      let newValueStr;
      if (currentValue === '0') {
        newValueStr = newChar;
      } else {
        newValueStr = currentValue + newChar;
      }

      const newValue = parseFloat(newValueStr);
      if (isNaN(newValue)) return;

      event.node.setDataValue(colId, newValue);

      calculateAmounts(rowNode, colId, newValue, rate);

    } catch (error) {
      console.error('Error in handleCellKeyDown:', error);
    }
  };

  const handleCellValueChanged = (event: CellValueChangedEvent) => {
    try {
      console.log('Cell value changed:', event);
      
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

      const rowNode = event.node;
      if (!rowNode || !rowNode.data) {
        console.error('No row node or data found');
        return;
      }

      if (colId === 'buy_currency' || colId === 'sell_currency') {
        const { buy_currency, sell_currency } = rowNode.data;
        
        if (buy_currency && sell_currency) {
          const currencyPair = `${buy_currency}/${sell_currency}`;
          console.log('Setting currency pair:', currencyPair);
          
          try {
            rowNode.setDataValue('currency_pair', currencyPair);
            
            if (rates?.has(currencyPair)) {
              const rate = rates.get(currencyPair);
              console.log(`Setting rate for ${currencyPair}:`, rate);
              rowNode.setDataValue('rate', rate);

              const { buy_amount, sell_amount } = rowNode.data;
              if (rate && buy_amount) {
                rowNode.setDataValue('sell_amount', buy_amount * rate);
              } else if (rate && sell_amount) {
                rowNode.setDataValue('buy_amount', sell_amount / rate);
              }
            }
          } catch (error) {
            console.error('Error updating row values:', error);
          }
        }
      }

      if (colId === 'buy_amount' || colId === 'sell_amount') {
        const { buy_currency, sell_currency } = rowNode.data;
        if (buy_currency && sell_currency) {
          const currencyPair = `${buy_currency}/${sell_currency}`;
          const rate = rates?.get(currencyPair);

          if (rate) {
            const newValue = event.newValue;
            if (newValue !== undefined && newValue !== null) {
              calculateAmounts(rowNode, colId, newValue, rate);
            }
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
          params.api.setFocusedCell(0, 'buy_currency');
        }}
        onCellValueChanged={handleCellValueChanged}
        onCellKeyDown={handleCellKeyDown}
      />
    </div>
  );
};

export default TradeDataGrid;