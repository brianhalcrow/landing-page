import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { tradeColumnDefs } from '../config/tradeColumnDefs';
import { GridStyles } from './GridStyles';

const TradeDataGrid = () => {
  const [rowData, setRowData] = useState([]);

  const { isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_request_draft_trades')
        .select('*');

      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }

      setRowData(data || []);
      return data;
    },
  });

  return (
    <div className="w-full h-[300px] mt-4">
      <GridStyles>
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact
            rowData={rowData}
            columnDefs={tradeColumnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            suppressCellFocus={true}
            animateRows={true}
          />
        </div>
      </GridStyles>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          Loading trades...
        </div>
      )}
    </div>
  );
};

export default TradeDataGrid;