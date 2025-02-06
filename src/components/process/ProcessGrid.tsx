import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';

const ProcessGrid = () => {
  const { data: processSettings, isLoading } = useQuery({
    queryKey: ['process-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_settings')
        .select(`
          *,
          process_options (
            option_name,
            process_type_id,
            process_types (
              process_name
            )
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  const columnDefs: ColDef[] = [
    {
      field: 'process_setting_id',
      headerName: 'ID',
      width: 80,
      sort: 'asc',
    },
    {
      field: 'process_options.process_types.process_name',
      headerName: 'Process',
      flex: 1,
    },
    {
      field: 'process_options.option_name',
      headerName: 'Option',
      flex: 1,
    },
    {
      field: 'setting_name',
      headerName: 'Setting Name',
      flex: 1,
    },
    {
      field: 'setting_type',
      headerName: 'Setting Type',
      flex: 1,
    },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 100,
      cellRenderer: (params: any) => {
        return params.value ? '✓' : '✗';
      },
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      flex: 1,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      },
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      flex: 1,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleString();
        }
        return '';
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        Loading process settings...
      </div>
    );
  }

  if (!processSettings?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No process settings found.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={processSettings}
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

export default ProcessGrid;