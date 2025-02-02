import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { HedgeRequestDraftTrade } from './types/tradeTypes';
import TradeDataGrid from './components/TradeDataGrid';

const CACHE_KEY = 'hedge-request-draft-trades-grid-state';

const InputTradeGrid = () => {
  const queryClient = useQueryClient();
  
  const emptyRow = {
    draft_id: '',
    base_currency: '',
    quote_currency: '',
    currency_pair: '',
    trade_date: '',
    settlement_date: '',
    buy_sell: '',
    buy_sell_currency_code: '',
    buy_sell_amount: 0
  };
  
  const cachedState = queryClient.getQueryData<HedgeRequestDraftTrade[]>([CACHE_KEY]) || [emptyRow];
  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>(cachedState);

  const updateCache = useCallback((newData: HedgeRequestDraftTrade[]) => {
    queryClient.setQueryData([CACHE_KEY], newData);
    setRowData(newData);
  }, [queryClient]);

  return (
    <div className="space-y-4">
      <TradeDataGrid 
        rowData={rowData}
        onRowDataChange={updateCache}
      />
    </div>
  );
};

export default InputTradeGrid;