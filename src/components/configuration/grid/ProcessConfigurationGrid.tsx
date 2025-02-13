
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { createBaseColumnDefs } from './columnDefs/baseColumns';
import { createProcessColumnGroups } from './columnDefs/processColumns';
import { createActionColumn } from './columnDefs/actionsColumn';
import { gridStyles } from './styles/gridStyles';

interface ProcessConfigurationGridProps {
  entities: any[];
  processTypes: any[];
}

const ProcessConfigurationGrid = ({ entities, processTypes }: ProcessConfigurationGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const baseColumnDefs = createBaseColumnDefs();
  const processColumnGroups = createProcessColumnGroups(processTypes);
  const actionsColumn = createActionColumn();

  const columnDefs = [...baseColumnDefs, ...processColumnGroups, actionsColumn];

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>{gridStyles}</style>
      <AgGridReact
        ref={gridRef}
        rowData={entities}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false,
          wrapHeaderText: true,
          autoHeaderHeight: true
        }}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default ProcessConfigurationGrid;
