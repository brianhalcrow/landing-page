import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions } from "ag-grid-enterprise";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstrumentsConfig } from "../hooks/useInstrumentsConfig";
import CheckboxCellRenderer from "../../grid/cellRenderers/CheckboxCellRenderer";
import ActionsCellRenderer from "../../grid/cellRenderers/ActionsCellRenderer";

import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

const defaultGridOptions: GridOptions = {
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: "agTextColumnFilter",
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  },
  groupDefaultExpanded: -1,
  rowGroupPanelShow: "always",
  groupDisplayType: "groupRows",
  animateRows: true,
  rowHeight: 24,
  headerHeight: 40,
  suppressRowClickSelection: true,
  enableCellTextSelection: true,
  enableRangeSelection: true,
  enableCharts: true,
  enableRangeHandle: true,
};

const sideBarConfig = {
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
};

const statusBarConfig = {
  statusPanels: [
    { statusPanel: "agTotalRowCountComponent", align: "left" },
    { statusPanel: "agFilteredRowCountComponent" },
    { statusPanel: "agSelectedRowCountComponent" },
    { statusPanel: "agAggregationComponent" },
  ],
};

const commonGroupColProps: Partial<ColDef> = {
  rowGroup: true,
  hide: true,
  enableRowGroup: true,
  filterParams: {
    buttons: ["reset", "apply"],
    defaultOption: "contains",
  },
};

export const InstrumentsConfigGrid = () => {
  const {
    configData,
    instruments,
    isLoading,
    pendingChanges,
    setPendingChanges,
    handleEditClick,
    handleSaveClick,
    currentlyEditing,
    hasPendingChanges,
  } = useInstrumentsConfig();

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const columnDefs: ColDef[] = [
    {
      field: "counterparty_type",
      headerName: "Type",
      ...commonGroupColProps,
    },
    {
      field: "country",
      headerName: "Country",
      ...commonGroupColProps,
    },
    {
      field: "counterparty_name",
      headerName: "Counterparty",
      width: 200,
      pinned: "left",
      suppressMovable: true,
      enableRowGroup: true,
      filter: "agTextColumnFilter",
      tooltipField: "counterparty_name",
      cellClass: (params) =>
        params.data?.isEditing ? "ag-cell-highlight" : "",
    },
    ...instruments.map((instrument) => ({
      field: `instruments.${instrument.id}`,
      headerName: instrument.instrument,
      width: 120,
      cellRenderer: CheckboxCellRenderer,
      enableValue: true,
      aggFunc: "count",
      filter: "agSetColumnFilter",
      tooltipField: "instrument",
      cellClass: (params) =>
        params.data?.isEditing ? "ag-cell-highlight" : "",
      cellRendererParams: {
        disabled: (params: any) => !params.data?.isEditing,
        onChange: (checked: boolean, data: any) => {
          if (!data?.counterparty_id) return;
          setPendingChanges((prev) => ({
            ...prev,
            [data.counterparty_id]: {
              ...prev[data.counterparty_id],
              [instrument.id]: checked,
            },
          }));
        },
      },
    })),
    {
      headerName: "Actions",
      field: "actions",
      width: 100,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: {
        onEditClick: handleEditClick,
        onSaveClick: handleSaveClick,
        currentlyEditing,
        hasPendingChanges,
      },
      pinned: "right",
      suppressMenu: true, // Correct placement
      sortable: false,
      filter: false,
      cellClass: (params) =>
        params.data?.isEditing ? "ag-cell-highlight" : "",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Instrument Configuration</h3>
      <div className="w-full h-[400px] ag-theme-alpine">
        <AgGridReact
          {...defaultGridOptions}
          rowData={configData}
          columnDefs={columnDefs}
          getRowId={(params) => params.data.counterparty_id}
          sideBar={sideBarConfig}
          statusBar={statusBarConfig}
        />
      </div>
    </div>
  );
};
