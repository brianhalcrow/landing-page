
import { AgGridReact } from 'ag-grid-react';
import { GridProps } from '../types/gridTypes';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createColumnDefs } from '../config/columnDefs';
import { GridStyles } from './GridStyles';

const DraftDataGrid = ({ rowData, onRowDataChange }: GridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const { data: validEntities } = useQuery({
    queryKey: ['valid-entities'],
    queryFn: async () => {
      console.log('Fetching valid entities...');
      
      const { data: configuredEntities, error: configError } = await supabase
        .from('client_legal_entity')
        .select(`
          entity_id,
          entity_name,
          functional_currency
        `);

      if (configError) {
        console.error('Error fetching configured entities:', configError);
        throw configError;
      }

      if (!configuredEntities?.length) {
        console.log('No configured entities found');
        return [];
      }

      console.log('Fetched valid entities:', configuredEntities);
      return configuredEntities;
    }
  });

  return (
    <div className="w-full h-[300px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={createColumnDefs(validEntities)}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        onCellValueChanged={(event) => {
          const newData = [...rowData];
          newData[event.rowIndex] = { 
            ...newData[event.rowIndex], 
            [event.colDef.field]: event.newValue 
          };
          onRowDataChange(newData);
        }}
      />
    </div>
  );
};

export default DraftDataGrid;
