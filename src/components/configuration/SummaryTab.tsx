
import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';
import { ColDef } from 'ag-grid-community';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import CheckboxCellRenderer from './grid/cellRenderers/CheckboxCellRenderer';

interface EntityConfiguration {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  accounting_rate_method: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  configurations: Record<string, boolean>;
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

      // Transform the configurations from the view into flat objects
      return data.map((config: EntityConfiguration) => ({
        ...config,
        ...(config.configurations || {})
      }));
    }
  });

  const getBaseColumns = (): ColDef[] => [
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
      field: 'accounting_rate_method',
      headerName: 'Rate Method',
      minWidth: 150,
      flex: 1,
      headerClass: 'ag-header-center'
    },
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

  const getDynamicColumns = (): ColDef[] => {
    if (!entityConfigs || entityConfigs.length === 0) return [];

    const firstRow = entityConfigs[0];
    const configKeys = Object.keys(firstRow).filter(key => 
      !['entity_id', 'entity_name', 'functional_currency', 'accounting_rate_method', 
        'is_active', 'created_at', 'updated_at', 'configurations'].includes(key)
    );

    return configKeys.map(key => ({
      field: key,
      headerName: key
        .replace('exp_', 'Exposure: ')
        .replace('setting_', 'Setting: ')
        .replace('process_', 'Process: ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
      minWidth: 150,
      flex: 1,
      headerClass: 'ag-header-center',
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        disabled: true
      }
    }));
  };

  const columnDefs = [...getBaseColumns(), ...getDynamicColumns()];

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

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
