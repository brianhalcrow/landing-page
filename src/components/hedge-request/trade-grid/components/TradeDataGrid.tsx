import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { useTradeData } from '../hooks/useTradeData';
import { useCellHandlers } from '../hooks/useCellHandlers';

interface TradeDataGridProps {
  draftId: number;
  rates?: Map<string, number>;
}

const TradeDataGrid = ({ draftId, rates }: TradeDataGridProps) => {
  const emptyRow: HedgeRequestDraftTrade = {
    id: 0,
    draft_id: draftId.toString(),
    buy_currency: null,
    sell_currency: null,
    trade_date: null,
    settlement_date: null,
    buy_amount: null,
    sell_amount: null,
    entity_id: null,
    entity_name: null,
    created_at: null,
    updated_at: null,
    spot_rate: null,
    contract_rate: null
  };

  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([emptyRow]);
  const columnDefs = useTradeColumns(rates);
  const { handleCellKeyDown, handleCellValueChanged } = useCellHandlers(rates);

  const { data: trades, error } = useTradeData(draftId, emptyRow);

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