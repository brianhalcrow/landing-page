
import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';
import { ColDef } from 'ag-grid-community';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import CheckboxCellRenderer from './grid/cellRenderers/CheckboxCellRenderer';

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

      // Transform the data to flatten configurations
      return data.map(config => {
        const flattened = {
          ...config,
          ...config.configurations
        };
        delete flattened.configurations;
        return flattened;
      });
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

    // Get all unique configuration keys from the first row
    const configKeys = Object.keys(entityConfigs[0]).filter(key => 
      !['entity_id', 'entity_name', 'functional_currency', 'accounting_rate_method', 
        'is_active', 'created_at', 'updated_at'].includes(key)
    );

    return configKeys.map(key => ({
      field: key,
      headerName: key,
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
