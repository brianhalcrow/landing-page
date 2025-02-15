
import { AgGridReact } from 'ag-grid-react';
import { useTradeColumns } from '../hooks/useTradeColumns';
import { GridStyles } from '../../grid/components/GridStyles';
import { useRef } from 'react';
import { HedgeRequestDraftTrade } from '../../grid/types';
import { useCellHandlers } from '../hooks/useCellHandlers';

interface TradeDataGridProps {
  rowData: HedgeRequestDraftTrade[];
  onRowDataChange: (data: HedgeRequestDraftTrade[]) => void;
  entityId?: string | null;
  entityName?: string | null;
}

const TradeDataGrid = ({ rowData, onRowDataChange, entityId, entityName }: TradeDataGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const columnDefs = useTradeColumns();
  const { handleCellKeyDown, handleCellValueChanged } = useCellHandlers();

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
        onCellKeyDown={handleCellKeyDown}
        onCellValueChanged={(event) => {
          handleCellValueChanged(event);
          const newData = [...rowData];
          newData[event.rowIndex] = { 
            ...event.data, 
            entity_id: entityId || event.data.entity_id,
            entity_name: entityName || event.data.entity_name
          };
          onRowDataChange(newData);
        }}
      />
    </div>
  );
};

export default TradeDataGrid;
