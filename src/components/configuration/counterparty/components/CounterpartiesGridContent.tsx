
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { createBaseColumnDefs, createCounterpartyColumns } from "../columnDefs/counterpartyColumns";
import ActionsCellRenderer from "../../grid/ActionsCellRenderer";
import { gridStyles } from "../styles/gridStyles";
import { GridStyles } from "@/components/shared/grid/GridStyles";

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
  const counterpartyColumns = counterparties ? createCounterpartyColumns(
    counterparties,
    editingRows,
    pendingChanges,
    setPendingChanges
  ) : [];

  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Entity Information',
      headerClass: 'header-center',
      children: baseColumns
    } as ColGroupDef,
    ...counterpartyColumns,
    {
      headerName: 'Actions',
      field: 'actions',
      width: 100,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: (params: any) => ({
        isEditing: editingRows[params.data?.entity_id] || false,
        onEditClick: () => onEditClick(params.data?.entity_id),
        onSaveClick: () => onSaveClick(params.data?.entity_id),
      }),
      headerClass: 'header-center',
      cellClass: 'cell-center'
    },
  ];

  return (
    <div className="space-y-4">
      <style>{gridStyles}</style>
      <div className="w-full h-[300px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={gridData}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            editable: false,
            sortable: true,
            filter: true,
          }}
          rowHeight={24}
          headerHeight={50}
          suppressRowTransform={true}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};
