
import { AgGridReact } from "ag-grid-react";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstrumentsConfig } from "../hooks/useInstrumentsConfig";
import CheckboxCellRenderer from "../../grid/cellRenderers/CheckboxCellRenderer";
import ActionsCellRenderer from "../../grid/cellRenderers/ActionsCellRenderer";
import type { ColDef } from "ag-grid-community";

export const InstrumentsConfigGrid = () => {
  const {
    configData,
    instruments,
    isLoading,
    editingRows,
    pendingChanges,
    setPendingChanges,
    handleEditClick,
    handleSaveClick,
  } = useInstrumentsConfig();

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const columnDefs: ColDef[] = [
    {
      field: "counterparty_type",
      headerName: "Type",
      rowGroup: true,
      hide: true,
    },
    {
      field: "country",
      headerName: "Country",
      rowGroup: true,
      hide: true,
    },
    {
      field: "counterparty_name",
      headerName: "Counterparty",
      width: 200,
      pinned: 'left',
      suppressMovable: true,
    },
    ...instruments.map((instrument) => ({
      field: `instruments.${instrument.id}`,
      headerName: instrument.instrument,
      width: 120,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        disabled: (params: any) => !editingRows[params.data?.counterparty_id],
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
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: (params: any) => ({
        isEditing: editingRows[params.data?.counterparty_id] || false,
        onEditClick: () => handleEditClick(params.data?.counterparty_id),
        onSaveClick: () => handleSaveClick(params.data?.counterparty_id),
      }),
      headerClass: 'header-center',
      cellClass: 'cell-center'
    },
  ];

  const getRowId = (params: any) => params.data.counterparty_id;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Instrument Configuration</h3>
      <div className="w-full h-[400px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={configData}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          groupDefaultExpanded={-1}
          getRowId={getRowId}
          rowGroupPanelShow="never"
          groupDisplayType="groupRows"
          animateRows={true}
          rowHeight={24}
          headerHeight={40}
          suppressRowClickSelection={true}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};
