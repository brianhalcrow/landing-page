import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-enterprise";
import {
  createBaseColumnDefs,
  createCounterpartyColumns,
} from "../columnDefs/counterpartyColumns";
import ActionsCellRenderer from "../../grid/ActionsCellRenderer";

// Enterprise AG Grid styles
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

interface CounterpartiesGridContentProps {
  gridData: any[];
  counterparties: any[];
  editingRows: Record<string, boolean>;
  pendingChanges: Record<string, Record<string, boolean>>;
  setPendingChanges: (changes: Record<string, Record<string, boolean>>) => void;
  onEditClick: (entityId: string) => void;
  onSaveClick: (entityId: string) => void;
}

export const CounterpartiesGridContent = ({
  gridData,
  counterparties,
  editingRows,
  pendingChanges,
  setPendingChanges,
  onEditClick,
  onSaveClick,
}: CounterpartiesGridContentProps) => {
  const baseColumns = createBaseColumnDefs();
  const counterpartyColumns = counterparties
    ? createCounterpartyColumns(
        counterparties,
        editingRows,
        pendingChanges,
        setPendingChanges
      )
    : [];

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Entity Information",
      children: baseColumns,
      marryChildren: true,
    } as ColGroupDef,
    ...counterpartyColumns,
    {
      // This should be ColDef, not part of a group
      headerName: "Actions",
      field: "actions",
      width: 100,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: (params: any) => ({
        isEditing: editingRows[params.data?.entity_id] || false,
        onEditClick: () => onEditClick(params.data?.entity_id),
        onSaveClick: () => onSaveClick(params.data?.entity_id),
      }),
      pinned: "right",
      suppressMenu: true,
      sortable: false,
      filter: false,
    } as ColDef, // Explicitly type as ColDef
  ];

  return (
    <div className="h-[300px] w-full ag-theme-alpine">
      <AgGridReact
        rowData={gridData}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: true,
          editable: false,
          sortable: true,
          filter: "agTextColumnFilter",
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
        }}
        // Grid options
        rowHeight={24}
        headerHeight={50}
        suppressRowTransform={true}
        enableCellTextSelection={true}
        suppressRowClickSelection={true}
        animateRows={true}
        // Enterprise features
        enableRangeSelection={true}
        enableCharts={true}
        enableRangeHandle={true}
        rowGroupPanelShow="always"
        groupDisplayType="groupRows"
        // Side panels
        sideBar={{
          toolPanels: [
            {
              id: "columns",
              labelDefault: "Columns",
              labelKey: "columns",
              iconKey: "columns",
              toolPanel: "agColumnsToolPanel",
            },
            {
              id: "filters",
              labelDefault: "Filters",
              labelKey: "filters",
              iconKey: "filter",
              toolPanel: "agFiltersToolPanel",
            },
          ],
          defaultToolPanel: "columns",
        }}
        // Status bar
        statusBar={{
          statusPanels: [
            { statusPanel: "agTotalRowCountComponent", align: "left" },
            { statusPanel: "agFilteredRowCountComponent" },
            { statusPanel: "agSelectedRowCountComponent" },
            { statusPanel: "agAggregationComponent" },
          ],
        }}
      />
    </div>
  );
};
