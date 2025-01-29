import { AgGridReact } from 'ag-grid-react';
import { useRef, useEffect } from 'react';
import { Tables } from '@/integrations/supabase/types';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { getColumnDefs } from './grid/columnDefinitions';
import { gridStyles } from './grid/gridStyles';
import EmptyGridMessage from './grid/EmptyGridMessage';

interface ConfigurationGridProps {
  entities: Tables<'pre_trade_sfx_config_exposures'>[];
}

const ConfigurationGrid = ({ entities }: ConfigurationGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: false, // Disable column resizing
    suppressSizeToFit: true, // Prevent columns from auto-fitting
  };

  const columnState = [
    { colId: 'entity_name', width: 250 },
    { colId: 'entity_id', width: 110 },
    { colId: 'functional_currency', width: 180 }, // Updated to match columnDefinitions
    { colId: 'monetary_assets', width: 130 },
    { colId: 'monetary_liabilities', width: 130 },
    { colId: 'net_monetary', width: 120 },
    { colId: 'revenue', width: 130 },
    { colId: 'costs', width: 100 },
    { colId: 'net_income', width: 110 },
    { colId: 'po', width: 130 },
    { colId: 'ap', width: 130 },
    { colId: 'ar', width: 140 },
    { colId: 'other', width: 100 },
    { colId: 'ap_realized', width: 130 },
    { colId: 'ar_realized', width: 140 },
    { colId: 'fx_realized', width: 130 },
  ];

  // Apply column state when grid is ready and when entities update
  useEffect(() => {
    if (gridRef.current?.columnApi) {
      gridRef.current.columnApi.applyColumnState({ state: columnState });
    }
  }, [entities]);

  if (!entities.length) {
    return <EmptyGridMessage />;
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>{gridStyles}</style>
      <AgGridReact
        ref={gridRef}
        rowData={entities}
        columnDefs={getColumnDefs()}
        defaultColDef={defaultColDef}
        animateRows={true}
      />
    </div>
  );
};

export default ConfigurationGrid;