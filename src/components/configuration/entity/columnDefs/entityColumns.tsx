
import { ColDef, ColGroupDef } from "ag-grid-community";
import { Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckboxCellRenderer from "../../grid/cellRenderers/CheckboxCellRenderer";
import { ExposureType } from "@/hooks/useExposureTypes";

// Base columns for entity information
export const createBaseColumnDefs = (): ColDef[] => [
  {
    field: "entity_id",
    headerName: "Entity ID",
    sortable: true,
    filter: true,
    width: 100,
    headerClass: 'header-left header-wrap',
    cellClass: 'cell-left',
  },
  {
    field: "entity_name",
    headerName: "Entity Name",
    sortable: true,
    filter: true,
    width: 200,
    headerClass: 'header-left header-wrap',
    cellClass: 'cell-left',
  },
  {
    field: "functional_currency",
    headerName: "Functional Currency",
    sortable: true,
    filter: true,
    width: 120,
    headerClass: 'header-left header-wrap',
    cellClass: 'cell-left',
  },
  {
    field: "accounting_rate_method",
    headerName: "Accounting Rate Method",
    sortable: true,
    filter: true,
    width: 150,
    headerClass: 'header-left header-wrap',
    cellClass: 'cell-left',
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

// Exposure columns definition
export const createExposureColumns = (
  exposureTypes: ExposureType[],
  editingRows: Record<string, boolean>,
  pendingChanges: Record<string, Record<number, boolean>>,
  setPendingChanges: (changes: Record<string, Record<number, boolean>>) => void
): ColGroupDef[] => {
  return exposureTypes.reduce((acc: ColGroupDef[], type) => {
    const l1Key = type.exposure_category_l1;
    const l2Key = type.exposure_category_l2;
    
    let l1Group = acc.find(group => group.headerName === l1Key);
    
    if (!l1Group) {
      l1Group = {
        headerName: l1Key,
        headerClass: 'header-center',
        children: []
      };
      acc.push(l1Group);
    }

    let l2Group = l1Group.children?.find(group => 
      (group as ColGroupDef).headerName === l2Key
    ) as ColGroupDef;

    if (!l2Group) {
      l2Group = {
        headerName: l2Key,
        headerClass: 'header-center',
        children: []
      };
      l1Group.children?.push(l2Group);
    }

    const l3Column: ColDef = {
      field: `exposure_configs.${type.exposure_type_id}`,
      headerName: type.exposure_category_l3,
      headerClass: 'header-center header-wrap',
      cellClass: 'cell-center',
      width: 150,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        disabled: (params: any) => !editingRows[params.data?.entity_id],
        getValue: function() {
          if (!this?.data?.entity_id) return false;
          
          const entityId = this.data.entity_id;
          const exposureTypeId = type.exposure_type_id;
          
          if (pendingChanges[entityId]?.[exposureTypeId] !== undefined) {
            return pendingChanges[entityId][exposureTypeId];
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
              [type.exposure_type_id]: isChecked
            }
          });
        },
      },
    };

    l2Group.children?.push(l3Column);

    return acc;
  }, []);
};
