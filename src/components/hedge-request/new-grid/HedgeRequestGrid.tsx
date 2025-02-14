
import { AgGridReact } from 'ag-grid-react';
import { GridStyles } from '../grid/components/GridStyles';
import { createColumnDefs } from './config/columnDefs';
import { useHedgeRequestData } from './hooks/useHedgeRequestData';
import { GridActions } from './components/GridActions';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const HedgeRequestGrid = () => {
  const {
    rowData,
    validConfigs,
    handleSave,
    addNewRow,
    updateRowData
  } = useHedgeRequestData();

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={rowData}
          columnDefs={createColumnDefs()}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false
          }}
          context={{ validConfigs }}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          onCellValueChanged={(event) => {
            updateRowData(event.rowIndex, event.colDef.field!, event.newValue);
          }}
          stopEditingWhenCellsLoseFocus={true}
        />
      </div>

      <GridActions onAddRow={addNewRow} onSave={handleSave} />
    </div>
  );
};

export default HedgeRequestGrid;
