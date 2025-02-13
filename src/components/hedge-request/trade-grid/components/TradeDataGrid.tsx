import { AgGridReact } from 'ag-grid-react';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { GridStyles } from '../../grid/components/GridStyles';
import { useRef } from 'react';
import { HedgeRequestDraftTrade } from '../../grid/types';

interface TradeDataGridProps {
  rowData: HedgeRequestDraftTrade[];
  onRowDataChange: (data: HedgeRequestDraftTrade[]) => void;
  entityId?: string | null;
  entityName?: string | null;
}

const TradeDataGrid = ({ rowData, onRowDataChange, entityId, entityName }: TradeDataGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const columnDefs = useTradeColumns();

  return (
    <div className="w-full h-[300px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
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
        onCellValueChanged={(event) => {
          const newData = [...rowData];
          newData[event.rowIndex] = { 
            ...newData[event.rowIndex], 
            [event.colDef.field]: event.newValue,
            entity_id: entityId || newData[event.rowIndex].entity_id,
            entity_name: entityName || newData[event.rowIndex].entity_name
          };
          onRowDataChange(newData);
        }}
      />
    </div>
  );
};

export default TradeDataGrid;