
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { format, differenceInMinutes } from 'date-fns';

interface PipelineExecution {
  id: number;
  pipeline_name: string;
  source_system: string;
  target_table: string;
  status: string;
  records_processed: number | null;
  start_time: string;
  end_time: string | null;
  error_message: string | null;
}

interface DataSourcesGridProps {
  executions: PipelineExecution[];
}

const DataSourcesGrid = ({ executions }: DataSourcesGridProps) => {
  const getStatusColor = (params: any) => {
    const status = params.value;
    const startTime = new Date(params.data.start_time);
    const now = new Date();
    const runningTooLong = differenceInMinutes(now, startTime) > 10;

    if (status === 'COMPLETED') return 'text-green-600';
    if (status === 'FAILED') return 'text-red-600';
    if (status === 'RUNNING' && runningTooLong) return 'text-orange-600';
    if (status === 'RUNNING') return 'text-blue-600';
    return '';
  };

  const getStatusText = (params: any) => {
    const status = params.value;
    const startTime = new Date(params.data.start_time);
    const now = new Date();
    const runningTooLong = differenceInMinutes(now, startTime) > 10;

    if (status === 'RUNNING' && runningTooLong) {
      return `${status} (Stale)`;
    }
    return status;
  };

  const columnDefs: ColDef[] = [
    { 
      field: 'pipeline_name', 
      headerName: 'Pipeline Name',
      flex: 1.5,
      minWidth: 200,
      headerClass: 'ag-header-center',
      cellClass: 'text-left pl-4'
    },
    { 
      field: 'source_system', 
      headerName: 'Source',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'target_table', 
      headerName: 'Target Table',
      flex: 1,
      minWidth: 150,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'status', 
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      cellClass: getStatusColor,
      valueFormatter: getStatusText
    },
    { 
      field: 'records_processed', 
      headerName: 'Records',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? params.value.toLocaleString() : '-'
    },
    { 
      field: 'start_time', 
      headerName: 'Start Time',
      flex: 1.2,
      minWidth: 180,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss') : '-'
    },
    { 
      field: 'end_time', 
      headerName: 'End Time',
      flex: 1.2,
      minWidth: 180,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => 
        params.value ? format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss') : '-'
    },
    { 
      field: 'error_message', 
      headerName: 'Error Message',
      flex: 2,
      minWidth: 200,
      headerClass: 'ag-header-center',
      cellClass: 'text-red-500',
      wrapText: true,
      autoHeight: true,
      cellStyle: { wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.5' }
    }
  ];

  return (
    <div className="ag-theme-alpine h-[600px] w-full">
      <GridStyles />
      <AgGridReact
        rowData={executions}
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
