
import { ColDef, ColGroupDef } from "ag-grid-community";
import { Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckboxCellRenderer from "../../grid/cellRenderers/CheckboxCellRenderer";
import { Counterparty } from "../types/entityTypes";

// Base columns for entity information
export const createBaseColumnDefs = (): ColDef[] => [
  {
    field: "entity_id",
    headerName: "Entity ID",
    sortable: true,
    filter: true,
    width: 120,
    headerClass: 'header-left header-wrap',
    cellClass: 'cell-left',
    pinned: 'left'
  },
  {
    field: "entity_name",
    headerName: "Entity Name",
    sortable: true,
    filter: true,
    width: 200,
    headerClass: 'header-left header-wrap',
    cellClass: 'cell-left',
    pinned: 'left'
  },
];

// Actions column definition
export const createActionsColumn = (
  editingRows: Record<string, boolean>,
  onEditClick: (entityId: string) => void,
  onSaveClick: (entityId: string) => void
): ColDef => ({
  headerName: "Actions",
  width: 100,
  pinned: 'right',
  cellRenderer: (params: any) => {
    const isEditing = editingRows[params.data.entity_id];
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const entityId = params.data.entity_id;
            if (isEditing) {
              onSaveClick(entityId);
            } else {
              onEditClick(entityId);
            }
          }}
          className="h-5 w-5 p-0"
        >
          {isEditing ? (
            <Save className="h-3 w-3" />
          ) : (
            <Edit className="h-3 w-3" />
          )}
        </Button>
      </div>
    );
  },
  cellClass: 'actions-cell',
});

// Counterparty columns definition
export const createCounterpartyColumns = (
  counterparties: Counterparty[],
  editingRows: Record<string, boolean>,
  pendingChanges: Record<string, Record<string, boolean>>,
  setPendingChanges: (changes: Record<string, Record<string, boolean>>) => void
): ColGroupDef[] => {
  // Group counterparties by type (Internal/External)
  const groupedCounterparties = counterparties.reduce((acc, counterparty) => {
    const type = counterparty.counterparty_type === 'Internal' ? 'Internal' : 'External';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(counterparty);
    return acc;
  }, {} as Record<string, Counterparty[]>);

  // Create column groups
  return ['Internal', 'External'].map(type => ({
    headerName: type,
    headerClass: 'header-center',
    children: (groupedCounterparties[type] || []).map(counterparty => ({
      field: `exposure_configs.${counterparty.counterparty_id}`,
      headerName: counterparty.counterparty_name || counterparty.counterparty_id,
      headerClass: 'header-center header-wrap',
      cellClass: 'cell-center',
      width: 150,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        disabled: (params: any) => !editingRows[params.data?.entity_id],
        getValue: function() {
          if (!this?.data?.entity_id) return false;
          
          const entityId = this.data.entity_id;
          const counterpartyId = counterparty.counterparty_id;
          
          if (pendingChanges[entityId]?.[counterpartyId] !== undefined) {
            return pendingChanges[entityId][counterpartyId];
          }
          return this.value;
        },
        onChange: (isChecked: boolean, data: any) => {
          if (!data?.entity_id) return;
          
          const entityId = data.entity_id;
          setPendingChanges({
            ...pendingChanges,
            [entityId]: {
              ...pendingChanges[entityId],
              [counterparty.counterparty_id]: isChecked
            }
          });
        },
      },
    })),
  }));
};
