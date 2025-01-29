import { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { HedgeRequest } from './types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface PositionsGridProps {
  hedgeRequests: HedgeRequest[];
}

const PositionsGrid = ({ hedgeRequests }: PositionsGridProps) => {
  const columnDefs: ColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 100 },
    { field: 'entity_name', headerName: 'Entity Name', width: 120 },
    { field: 'instrument', headerName: 'Instrument', width: 100 },
    { field: 'strategy', headerName: 'Strategy', width: 100 },
    { field: 'base_currency', headerName: 'Base', width: 70 },
    { field: 'quote_currency', headerName: 'Quote', width: 70 },
    { field: 'currency_pair', headerName: 'Pair', width: 80 },
    { field: 'trade_date', headerName: 'Trade Date', width: 100 },
    { field: 'settlement_date', headerName: 'Settlement', width: 100 },
    { field: 'buy_sell', headerName: 'B/S', width: 60 },
    { field: 'buy_sell_currency_code', headerName: 'B/S Curr', width: 80 },
    { 
      field: 'buy_sell_amount', 
      headerName: 'Amount', 
      width: 100,
      type: 'numericColumn',
    },
    { field: 'created_by', headerName: 'Created By', width: 120 },
    { field: 'trade_request_id', headerName: 'Request ID', width: 120 },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="h-[600px] w-full ag-theme-alpine dark:ag-theme-alpine-dark">
      <AgGridReact
        rowData={hedgeRequests}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        rowSelection="multiple"
      />
    </div>
  );
};

export default PositionsGrid;