import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';
import { ColDef } from 'ag-grid-community';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import CheckboxCellRenderer from './grid/cellRendlers/CheckboxCellRenderer';
import { Json } from '@/integrations/supabase/types';

interface EntityConfig {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  cost_centre_count: number;
  currency_count: number;
  accounting_rate_method?: string;
  configurations?: {
    process_settings?: Record<string, { value: string }>;
    exposure_config?: Record<string, boolean>;
  } & Json;
  updated_at?: string;
}

const SummaryTab = () => {
  const { toast } = useToast();
  
  const { data: entityConfigs, isLoading } = useQuery({
    queryKey: ['entity-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_entity_configurations')
        .select('*');
      
      if (error) {
        console.error('Error fetching entity configurations:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load entity configurations"
        });
        throw error;
      }

      // Transform the data to match the EntityConfig interface
      const transformedData: EntityConfig[] = (data || []).map(item => ({
        ...item,
        accounting_rate_method: '',
        updated_at: new Date().toISOString(),
        configurations: {}
      }));

      return transformedData;
    }
  });

  const generateColumns = (data: any[]): ColDef[] => {
    if (!data?.length) return [];

    const baseColumns: ColDef[] = [
      {
        field: 'entity_id',
        headerName: 'Entity ID',
        minWidth: 120,
        flex: 1,
        headerClass: 'ag-header-center'
      },
      {
        field: 'entity_name',
        headerName: 'Entity Name',
        minWidth: 200,
        flex: 2,
        headerClass: 'ag-header-center'
      },
      {
        field: 'functional_currency',
        headerName: 'Currency',
        minWidth: 100,
        flex: 1,
        headerClass: 'ag-header-center'
      },
      {
        field: 'cost_centre_count',
        headerName: 'Cost Centre Count',
        minWidth: 150,
        flex: 1,
        headerClass: 'ag-header-center'
      },
      {
        field: 'currency_count',
        headerName: 'Currency Count',
        minWidth: 150,
        flex: 1,
        headerClass: 'ag-header-center'
      }
    ];

    // Get all unique process and exposure columns
    const sample = data[0];
    const dynamicColumns = Object.keys(sample)
      .filter(key => key.startsWith('process_') || key.startsWith('exposure_'))
      .map(key => ({
        field: key,
        headerName: key
          .replace('process_', '')
          .replace('exposure_', '')
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        minWidth: 120,
        flex: 1,
        headerClass: 'ag-header-center',
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: {
          disabled: true
        }
      }));

    return [
      ...baseColumns,
      ...dynamicColumns,
      {
        field: 'updated_at',
        headerName: 'Last Updated',
        minWidth: 180,
        flex: 1.5,
        headerClass: 'ag-header-center',
        valueFormatter: (params) => {
          return params.value ? new Date(params.value).toLocaleString() : '';
        }
      }
    ];
  };

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  const columnDefs = generateColumns(entityConfigs || []);

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={entityConfigs}
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

export default SummaryTab;
