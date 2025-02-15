
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import { GridStyles } from '@/components/shared/grid/GridStyles';
import { createColumnDefs } from './config/columnDefs';
import { GridActions } from './components/GridActions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface NewHedgeRequestGridProps {
  rowData: any[];
  onRowDataChange: (newData: any[]) => void;
}

const NewHedgeRequestGrid = ({ rowData, onRowDataChange }: NewHedgeRequestGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const handleAddRow = () => {
    const newData = [...rowData, {}];
    onRowDataChange(newData);
  };

  const updateRowData = (rowIndex: number, updates: any) => {
    const newData = [...rowData];
    newData[rowIndex] = { ...newData[rowIndex], ...updates };
    onRowDataChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={createColumnDefs(gridRef.current?.api || null, { updateRowData })}
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
      <GridActions 
        onAddRow={handleAddRow}
        rowData={rowData}
      />
    </div>
  );
};

export default NewHedgeRequestGrid;
