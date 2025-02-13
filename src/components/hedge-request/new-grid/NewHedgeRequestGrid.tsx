
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import { GridStyles } from '@/components/shared/grid/GridStyles';
import { createColumnDefs } from './config/columnDefs';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface NewHedgeRequestGridProps {
  rowData: any[];
  onRowDataChange: (newData: any[]) => void;
}

const NewHedgeRequestGrid = ({ rowData, onRowDataChange }: NewHedgeRequestGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={createColumnDefs()}
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

export default NewHedgeRequestGrid;
