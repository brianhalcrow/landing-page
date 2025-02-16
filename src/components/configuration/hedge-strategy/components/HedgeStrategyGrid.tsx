import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions } from "ag-grid-enterprise";
import { HedgeStrategyGridRow } from "../types/hedgeStrategy.types";

// Enterprise AG Grid styles
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

interface HedgeStrategyGridProps {
  rowData: HedgeStrategyGridRow[];
  columnDefs: ColDef[];
}

export const HedgeStrategyGrid = ({
  rowData,
  columnDefs,
}: HedgeStrategyGridProps) => {
  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: "agTextColumnFilter",
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
        }}
        groupDefaultExpanded={-1}
        animateRows={true}
        suppressRowClickSelection={true}
        enableRangeSelection={true}
        enableCharts={true}
        enableRangeHandle={true}
        rowGroupPanelShow="always"
        groupDisplayType="groupRows"
      />
    </div>
  );
};
