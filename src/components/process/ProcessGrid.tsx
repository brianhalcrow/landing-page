import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { useProcessData } from "./hooks/useProcessData";
import { useProcessSettings } from "./hooks/useProcessSettings";
import {
  createBaseColumnDefs,
  createProcessColumnGroups,
  createActionsColumn,
} from "./utils/columnDefs";

const ProcessGrid = () => {
  const { processTypes, entitySettings, isLoading } = useProcessData();
  const { updateSettings } = useProcessSettings();

  const handleCellValueChanged = async (params: any) => {
    if (params.data?.isEditing) {
      const fieldName = params.column.getColId();
      if (fieldName.startsWith("setting_")) {
        const processSettingId = parseInt(fieldName.replace("setting_", ""));
        const updates = [
          {
            entityId: params.data.entity_id,
            processSettingId,
            settingValue: params.newValue.toString(),
          },
        ];

        try {
          await updateSettings.mutateAsync(updates);
        } catch (error) {
          console.error("Error saving changes:", error);
        }
      }
    }
  };

  const columnDefs = [
    ...createBaseColumnDefs(),
    ...createProcessColumnGroups(processTypes),
    createActionsColumn(),
  ];

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        Loading process settings...
      </div>
    );
  }

  if (!entitySettings?.length) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">
        No entities found with exposure type 4.
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <GridStyles />
      <AgGridReact
        rowData={entitySettings}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false,
        }}
        animateRows={true}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
        onCellValueChanged={handleCellValueChanged}
      />
    </div>
  );
};

export default ProcessGrid;
