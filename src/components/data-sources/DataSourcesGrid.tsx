import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format } from 'date-fns';

interface TableConnection {
  table_name: string;
  type: string;
  status: string;
  size: string;
  column_count: number;
  record_count: number;
  last_update: string;
  next_update: string;
}

interface DataSourcesGridProps {
  connections: TableConnection[];
}

const DataSourcesGrid = ({ connections }: DataSourcesGridProps) => {
  const columnDefs: ColDef[] = [
    { 
      field: 'table_name', 
      headerName: 'Table Name',
      flex: 1.5,
      minWidth: 150,
      headerClass: 'ag-header-center',
      cellClass: 'text-left pl-4'
    },
    { 
      field: 'type', 
      headerName: 'Type',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      cellClass: (params) => {
        if (params.value === 'Active') return 'text-green-600';
        if (params.value === 'Inactive') return 'text-red-600';
        return '';
      }
    },
    { 
      field: 'size', 
      headerName: 'Size',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'column_count', 
      headerName: 'Columns',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'record_count', 
      headerName: 'Records',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? params.value.toLocaleString() : '0'
    },
    { 
      field: 'last_update', 
      headerName: 'Last Update',
      flex: 1.2,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss') : ''
    },
    { 
      field: 'next_update', 
      headerName: 'Next Update',
      flex: 1.2,
      minWidth: 160,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss') : ''
    }
  ];

  return (
    <div className="ag-theme-alpine h-[600px] w-full">
      <GridStyles />
      <AgGridReact
        rowData={connections}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default DataSourcesGrid;