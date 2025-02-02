import { useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Position } from './types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface PositionsGridProps {
  hedgeRequests: Position[];
}

const PositionsGrid = ({ hedgeRequests }: PositionsGridProps) => {
  const columnDefs: ColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 110 },
    { field: 'entity_name', headerName: 'Entity Name', width: 150 },
    { field: 'instrument', headerName: 'Instrument', width: 120 },
    { field: 'strategy', headerName: 'Strategy', width: 120 },
    { field: 'base_currency', headerName: 'Base', width: 90 },
    { field: 'quote_currency', headerName: 'Quote', width: 90 },
    { field: 'trade_date', headerName: 'Trade Date', width: 120 },
    { field: 'settlement_date', headerName: 'Settlement', width: 120 },
    { field: 'buy_sell', headerName: 'B/S', width: 80 },
    { field: 'buy_sell_currency_code', headerName: 'B/S Curr', width: 100 },
    { 
      field: 'buy_sell_amount', 
      headerName: 'Amount', 
      width: 120,
      type: 'numericColumn',
    },
    { field: 'created_by', headerName: 'Created By', width: 140 },
    { field: 'trade_request_id', headerName: 'Request ID', width: 140 },
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