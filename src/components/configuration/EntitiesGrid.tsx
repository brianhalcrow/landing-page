import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Tables } from '@/integrations/supabase/types';

interface EntitiesGridProps {
  entities: Tables<'pre_trade_sfx_config_entity'>[];
}

const EntitiesGrid = ({ entities }: EntitiesGridProps) => {
  const columnDefs: ColDef[] = [
    { field: 'entity_id', headerName: 'Entity ID', width: 110 },
    { field: 'entity_name', headerName: 'Entity Name', width: 150 },
    { field: 'functional_currency', headerName: 'Functional Currency', width: 120 },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <AgGridReact
        rowData={entities}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
      />
    </div>
  );
};

export default EntitiesGrid;