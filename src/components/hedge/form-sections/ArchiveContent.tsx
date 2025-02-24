import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const mockData = [
  {
    hedgeId: 'H001',
    documentationDate: '2024-03-15',
    entityName: 'ACME Corp',
    hedgeType: 'Cash Flow',
    hedgedItemType: 'Forecasted Revenue',
    exposedCurrency: 'USD/EUR',
    amount: '1,000,000',
    status: 'Archived'
  }
];

export const ArchiveContent = () => {
  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'hedgeId', headerName: 'Hedge ID', sortable: true, filter: true },
    { field: 'documentationDate', headerName: 'Doc Date', sortable: true, filter: true },
    { field: 'entityName', headerName: 'Entity Name', sortable: true, filter: true },
    { field: 'hedgeType', headerName: 'Hedge Type', sortable: true, filter: true },
    { field: 'hedgedItemType', headerName: 'Hedged Item Type', sortable: true, filter: true },
    { field: 'exposedCurrency', headerName: 'Exposed Currency', sortable: true, filter: true },
    { field: 'amount', headerName: 'Amount', sortable: true, filter: true },
    { field: 'status', headerName: 'Status', sortable: true, filter: true }
  ], []);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  return (
    <div className="bg-white rounded-lg shadow h-[600px] w-full">
      <div className="ag-theme-alpine h-full w-full">
        <AgGridReact
          rowData={mockData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};