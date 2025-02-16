import { ColDef, ColGroupDef } from "ag-grid-enterprise";
import { Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckboxCellRenderer from "../../grid/cellRenderers/CheckboxCellRenderer";
import { ExposureType } from "@/hooks/useExposureTypes";

// Define interface for base column configuration
interface BaseColumnConfig {
  field: string;
  headerName: string;
  width: number;
  filter?: string | boolean;
}

// Common properties for all columns
const commonColProps: Partial<ColDef> = {
  sortable: true,
  filter: "agTextColumnFilter",
  enableRowGroup: true,
  enablePivot: true,
  filterParams: {
    buttons: ["reset", "apply"],
    defaultOption: "contains",
  },
};

// Base column configurations
const baseColumnConfig: BaseColumnConfig[] = [
  {
    field: "entity_id",
    headerName: "Entity ID",
    width: 100,
  },
  {
    field: "entity_name",
    headerName: "Entity Name",
    width: 200,
  },
  {
    field: "functional_currency",
    headerName: "Functional Currency",
    width: 120,
    filter: "agSetColumnFilter",
  },
  {
    field: "accounting_rate_method",
    headerName: "Accounting Rate Method",
    width: 150,
    filter: "agSetColumnFilter",
  },
];

// Create base columns with common properties
export const createBaseColumnDefs = (): ColDef[] =>
  baseColumnConfig.map(
    (col: BaseColumnConfig): ColDef => ({
      ...commonColProps,
      ...col,
    })
  );

// Actions column definition
export const createActionsColumn = (
  editingRows: Record<string, boolean>,
  onEditClick: (entityId: string) => void,
  onSaveClick: (entityId: string) => void
): ColDef => ({
  headerName: "Actions",
  width: 100,
  pinned: "right",
  suppressMovable: true,
  sortable: false,
  filter: false,
  cellRenderer: (params: any) => {
    const isEditing = editingRows[params.data.entity_id];
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const entityId = params.data.entity_id;
            isEditing ? onSaveClick(entityId) : onEditClick(entityId);
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
});

// Common properties for exposure columns
const exposureColProps: Partial<ColDef> = {
  ...commonColProps,
  width: 150,
  enableValue: true,
  aggFunc: "count",
  filter: "agSetColumnFilter",
};

// Common properties for column groups
const groupProps: Partial<ColGroupDef> = {
  marryChildren: true,
  openByDefault: true,
};

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

    let l1Group = acc.find((group) => group.headerName === l1Key);

    if (!l1Group) {
      l1Group = {
        headerName: l1Key,
        ...groupProps,
        children: [],
      };
      acc.push(l1Group);
    }

    let l2Group = l1Group.children?.find(
      (group) => (group as ColGroupDef).headerName === l2Key
    ) as ColGroupDef;

    if (!l2Group) {
      l2Group = {
        headerName: l2Key,
        ...groupProps,
        children: [],
      };
      l1Group.children?.push(l2Group);
    }

    const l3Column: ColDef = {
      ...exposureColProps,
      field: `exposure_configs.${type.exposure_type_id}`,
      headerName: type.exposure_category_l3,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        disabled: (params: any) => !editingRows[params.data?.entity_id],
        getValue: function () {
          if (!this?.data?.entity_id) return false;
          const entityId = this.data.entity_id;
          const exposureTypeId = type.exposure_type_id;
          return pendingChanges[entityId]?.[exposureTypeId] ?? this.value;
        },
        onChange: (isChecked: boolean, data: any) => {
          if (!data?.entity_id) return;
          const entityId = data.entity_id;
          setPendingChanges({
            ...pendingChanges,
            [entityId]: {
              ...pendingChanges[entityId],
              [type.exposure_type_id]: isChecked,
            },
          });
        },
      },
    };

    l2Group.children?.push(l3Column);
    return acc;
  }, []);
};
