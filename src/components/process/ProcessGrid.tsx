import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';

const ProcessGrid = () => {
  const { data: processTypes, isLoading } = useQuery({
    queryKey: ['process-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('process_types')
        .select(`
          *,
          exposure_types (
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  const columnDefs: ColDef[] = [
    {
      field: 'process_type_id',
      headerName: 'ID',
      width: 80,
      sort: 'asc',
    },
    {
      field: 'process_name',
      headerName: 'Process Name',
      flex: 1,
    },
    {
      field: 'exposure_types.exposure_category_l1',
      headerName: 'Exposure Category L1',
      flex: 1,
    },
    {
      field: 'exposure_types.exposure_category_l2',
      headerName: 'Exposure Category L2',
      flex: 1,
    },
    {
      field: 'exposure_types.exposure_category_l3',
      headerName: 'Exposure Category L3',
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
        Loading process types...
      </div>
    );
  }

  if (!processTypes?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No process types found.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={processTypes}
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