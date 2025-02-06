
import { AgGridReact } from 'ag-grid-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GridStyles } from '../hedge-request/grid/components/GridStyles';
import { ColDef } from 'ag-grid-community';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import CheckboxCellRenderer from './grid/cellRendlers/CheckboxCellRenderer';

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

      // Transform data to flatten process settings and exposure config
      return data.map(config => {
        const flattenedConfig = {
          entity_id: config.entity_id,
          entity_name: config.entity_name,
          functional_currency: config.functional_currency,
          accounting_rate_method: config.accounting_rate_method,
          updated_at: config.updated_at,
        };

        // Add process settings as individual columns
        if (config.process_settings) {
          Object.entries(config.process_settings).forEach(([key, value]: [string, any]) => {
            flattenedConfig[`process_${key}`] = value.value === 'true';
          });
        }

        // Add exposure configs as individual columns
        if (config.exposure_config) {
          Object.entries(config.exposure_config).forEach(([key, value]: [string, any]) => {
            if (key !== 'no_exposure') {
              flattenedConfig[`exposure_${key}`] = true; // If it exists in config, it's enabled
            }
          });
        }

        return flattenedConfig;
      });
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
        field: 'accounting_rate_method',
        headerName: 'Rate Method',
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
