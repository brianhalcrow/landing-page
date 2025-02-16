import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef, GridOptions } from "ag-grid-enterprise";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LegalEntity, PendingChanges } from "./types/entityTypes";
import {
  createBaseColumnDefs,
  createActionsColumn,
  createExposureColumns,
} from "./columnDefs/entityColumns";
import { useExposureTypes } from "@/hooks/useExposureTypes";

// Enterprise AG Grid styles
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-alpine.css";

// Common grid options
const defaultGridOptions: GridOptions = {
  defaultColDef: {
    resizable: true,
    editable: false,
    sortable: true,
    filter: "agTextColumnFilter",
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    menuTabs: ["filterMenuTab", "generalMenuTab", "columnsMenuTab"],
  },
  rowHeight: 24,
  headerHeight: 50,
  suppressRowTransform: true,
  enableCellTextSelection: true,
  suppressRowClickSelection: true,
  animateRows: true,
  enableRangeSelection: true,
  enableCharts: true,
  enableRangeHandle: true,
  rowGroupPanelShow: "always",
  groupDisplayType: "groupRows",
};

// Side panel configuration
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

// Status bar configuration
const statusBarConfig = {
  statusPanels: [
    { statusPanel: "agTotalRowCountComponent", align: "left" },
    { statusPanel: "agFilteredRowCountComponent" },
    { statusPanel: "agSelectedRowCountComponent" },
    { statusPanel: "agAggregationComponent" },
  ],
};

const EntityGrid = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  // Fetch exposure types
  const { data: exposureTypes } = useExposureTypes();

  // Fetch entities with their exposure configs
  const { data: entities, isLoading } = useQuery({
    queryKey: ["legal-entities-with-config"],
    queryFn: async () => {
      const { data: legalEntities, error: entityError } = await supabase
        .from("erp_legal_entity")
        .select("*")
        .order("entity_name");

      if (entityError) throw entityError;

      const { data: exposureConfigs, error: configError } = await supabase
        .from("entity_exposure_config")
        .select("*");

      if (configError) throw configError;

      // Map entities with their configs
      return legalEntities.map((entity) => ({
        ...entity,
        exposure_configs: exposureConfigs
          .filter((config) => config.entity_id === entity.entity_id)
          .reduce(
            (acc, config) => ({
              ...acc,
              [config.exposure_type_id]: config.is_active,
            }),
            {}
          ),
      }));
    },
  });

  // Batch update mutation
  const updateConfigsMutation = useMutation({
    mutationFn: async ({
      entityId,
      changes,
    }: {
      entityId: string;
      changes: Record<number, boolean>;
    }) => {
      const updates = Object.entries(changes).map(
        ([exposureTypeId, isActive]) => ({
          entity_id: entityId,
          exposure_type_id: parseInt(exposureTypeId),
          is_active: isActive,
        })
      );

      const { error } = await supabase
        .from("entity_exposure_config")
        .upsert(updates, {
          onConflict: "entity_id,exposure_type_id",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["legal-entities-with-config"],
      });
      toast.success("Configuration updated successfully");
    },
    onError: (error) => {
      console.error("Error updating configuration:", error);
      toast.error("Failed to update configuration");
    },
  });

  // Row edit handlers
  const handleEditClick = (entityId: string) => {
    setEditingRows((prev) => ({
      ...prev,
      [entityId]: true,
    }));
  };

  const handleSaveClick = (entityId: string) => {
    const changes = pendingChanges[entityId];
    if (changes) {
      updateConfigsMutation.mutate({ entityId, changes });
    }
    setEditingRows((prev) => ({
      ...prev,
      [entityId]: false,
    }));
    setPendingChanges((prev) => {
      const newPending = { ...prev };
      delete newPending[entityId];
      return newPending;
    });
  };

  // Create column definitions
  const columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Entity Information",
      marryChildren: true,
      children: createBaseColumnDefs(),
    } as ColGroupDef,
    ...(exposureTypes
      ? createExposureColumns(
          exposureTypes,
          editingRows,
          pendingChanges,
          setPendingChanges
        )
      : []),
    createActionsColumn(editingRows, handleEditClick, handleSaveClick),
  ];

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <div className="w-full h-[600px] ag-theme-alpine">
        <AgGridReact
          {...defaultGridOptions}
          rowData={entities}
          columnDefs={columnDefs}
          sideBar={sideBarConfig}
          statusBar={statusBarConfig}
        />
      </div>
    </div>
  );
};

export default EntityGrid;
