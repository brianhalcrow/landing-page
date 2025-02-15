
import { AgGridReact } from 'ag-grid-react';
import { createColumnDefs } from './config/columnDefs';
import { useHedgeRequestData } from './hooks/useHedgeRequestData';
import { GridActions } from './components/GridActions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const HedgeRequestGrid = () => {
  const {
    rowData,
    validConfigs,
    addNewRow,
    updateRowData
  } = useHedgeRequestData();

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={createColumnDefs()}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false
          }}
          context={{ 
            validConfigs,
            updateRowData 
          }}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          stopEditingWhenCellsLoseFocus={true}
        />
      </div>

      <GridActions 
        onAddRow={addNewRow}
        rowData={rowData}
      />
    </div>
  );
};

export default HedgeRequestGrid;
