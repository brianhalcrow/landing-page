import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import { createTradeColumnDefs } from '../config/tradeColumnDefs';
import { GridStyles } from './GridStyles';
import { TradeGridProps } from '../types/tradeTypes';

const TradeDataGrid = ({ rowData, onRowDataChange }: TradeGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  return (
    <div className="w-full h-[300px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={createTradeColumnDefs()}
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

export default TradeDataGrid;