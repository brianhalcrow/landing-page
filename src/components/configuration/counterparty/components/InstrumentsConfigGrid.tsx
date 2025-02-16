
import { AgGridReact } from "ag-grid-react";
import { ColDef, GridOptions, ICellRendererParams } from "ag-grid-enterprise";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstrumentsConfig } from "../hooks/useInstrumentsConfig";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    autoHeaderHeight: true,
    wrapHeaderText: true,
    suppressColumnsToolPanel: false,
  },
  groupDefaultExpanded: -1,
  rowGroupPanelShow: "always",
  groupDisplayType: "groupRows",
  animateRows: true,
  rowHeight: 48,
  headerHeight: 40,
  suppressRowClickSelection: true,
  enableCellTextSelection: true,
  enableRangeSelection: true,
  enableCharts: true,
  enableRangeHandle: true,
  // Enhanced enterprise features
  suppressPropertyNamesCheck: true,
  masterDetail: true,
  detailRowAutoHeight: true,
  tooltipShowDelay: 0,
  tooltipHideDelay: 2000,
  // Row grouping improvements
  groupIncludeFooter: true,
  groupSelectsChildren: true,
  // Chart options
  chartThemes: ["ag-default-dark", "ag-default"],
  // State management
  enableCellChangeFlash: true,
  statusBar: {
    statusPanels: [
      { statusPanel: "agTotalRowCountComponent", align: "left" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" }
    ]
  }
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
  position: "right",
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

const CheckboxCellRenderer = (props: ICellRendererParams) => {
  const checked = props.value || false;
  const isEditing = props.data?.isEditing;
  const onChange = props.colDef.cellRendererParams?.onChange;

  return (
    <div className="flex items-center justify-center h-full">
      <input
        type="checkbox"
        checked={checked}
        disabled={!isEditing}
        onChange={(e) => onChange?.(e.target.checked, props.data)}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
    </div>
  );
};

const ActionsCellRenderer = (props: ICellRendererParams) => {
  const { data, colDef } = props;
  const { onEditClick, onSaveClick, currentlyEditing, hasPendingChanges } = colDef.cellRendererParams || {};
  
  const isEditing = data?.isEditing;
  const isDisabled = currentlyEditing && currentlyEditing !== data?.counterparty_id;

  const handleClick = () => {
    if (isEditing) {
      onSaveClick?.(data?.counterparty_id);
    } else {
      onEditClick?.(data?.counterparty_id);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={!isEditing && (isDisabled || hasPendingChanges)}
        className="h-8 w-8 p-0"
      >
        {isEditing ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-blue-600" />
        )}
      </Button>
    </div>
  );
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
      enablePivot: true,
    },
    {
      field: "country",
      headerName: "Country",
      ...commonGroupColProps,
      enablePivot: true,
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
      filterParams: {
        buttons: ["reset", "apply"],
        closeOnApply: true,
      },
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
      menuTabs: [],
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
          tooltipShowDelay={0}
          tooltipHideDelay={2000}
          rowGroupPanelShow="always"
          groupDefaultExpanded={-1}
          enableCharts={true}
          enableRangeSelection={true}
        />
      </div>
    </div>
  );
};
