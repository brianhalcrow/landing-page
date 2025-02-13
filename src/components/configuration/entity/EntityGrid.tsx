import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { toast } from "sonner";
import { Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import CheckboxCellRenderer from "../grid/cellRenderers/CheckboxCellRenderer";

interface LegalEntity {
  entity_id: string;
  entity_name: string;
  local_currency: string;
  functional_currency: string;
  accounting_rate_method: string;
  isEditing?: boolean;
  exposure_configs?: Record<number, boolean>;
}

const EntityGrid = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});

  // Fetch exposure types
  const { data: exposureTypes } = useQuery({
    queryKey: ["exposure-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exposure_types")
        .select("*")
        .eq("is_active", true)
        .order("exposure_type_id");

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch entities with their exposure configs
  const { data: entities, isLoading } = useQuery({
    queryKey: ["legal-entities-with-config"],
    queryFn: async () => {
      // First get all legal entities
      const { data: legalEntities, error: entityError } = await supabase
        .from("erp_legal_entity")
        .select("*")
        .order("entity_name");

      if (entityError) throw entityError;

      // Then get all exposure configs
      const { data: exposureConfigs, error: configError } = await supabase
        .from("entity_exposure_config")
        .select("*");

      if (configError) throw configError;

      // Combine the data
      return legalEntities.map((entity) => ({
        ...entity,
        exposure_configs: exposureConfigs
          .filter((config) => config.entity_id === entity.entity_id)
          .reduce((acc, config) => ({
            ...acc,
            [config.exposure_type_id]: config.is_active,
          }), {}),
      }));
    },
  });

  // Update exposure config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async ({ 
      entityId, 
      exposureTypeId, 
      isActive 
    }: { 
      entityId: string; 
      exposureTypeId: number; 
      isActive: boolean 
    }) => {
      const { error } = await supabase
        .from("entity_exposure_config")
        .upsert({
          entity_id: entityId,
          exposure_type_id: exposureTypeId,
          is_active: isActive,
        }, {
          onConflict: 'entity_id,exposure_type_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-entities-with-config"] });
      toast.success("Configuration updated successfully");
    },
    onError: (error) => {
      console.error("Error updating configuration:", error);
      toast.error("Failed to update configuration");
    },
  });

  // Create base columns
  const baseColumnDefs: ColDef[] = [
    {
      field: "entity_id",
      headerName: "Entity ID",
      sortable: true,
      filter: true,
      width: 130,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "entity_name",
      headerName: "Entity Name",
      sortable: true,
      filter: true,
      flex: 1,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "functional_currency",
      headerName: "Functional Currency",
      sortable: true,
      filter: true,
      width: 150,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "local_currency",
      headerName: "Local Currency",
      sortable: true,
      filter: true,
      width: 150,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
    {
      field: "accounting_rate_method",
      headerName: "Accounting Rate Method",
      sortable: true,
      filter: true,
      width: 180,
      wrapHeaderText: true,
      autoHeaderHeight: true,
    },
  ];

  // Create exposure type columns dynamically
  const exposureColumns: ColDef[] = exposureTypes?.map((type) => ({
    field: `exposure_configs.${type.exposure_type_id}`,
    headerName: `${type.exposure_category_l1} - ${type.exposure_category_l2}`,
    width: 200,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellRenderer: CheckboxCellRenderer,
    cellRendererParams: {
      disabled: !editingRows[type.exposure_type_id],
      onChange: (isChecked: boolean, data: any) => {
        if (!editingRows[data.entity_id]) return;
        
        updateConfigMutation.mutate({
          entityId: data.entity_id,
          exposureTypeId: type.exposure_type_id,
          isActive: isChecked,
        });
      },
    },
  })) || [];

  // Add actions column
  const actionsColumn: ColDef = {
    headerName: "Actions",
    width: 100,
    cellRenderer: (params: any) => {
      const isEditing = editingRows[params.data.entity_id];
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditingRows(prev => ({
              ...prev,
              [params.data.entity_id]: !isEditing
            }));
          }}
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
        </Button>
      );
    },
  };

  const columnDefs = [...baseColumnDefs, ...exposureColumns, actionsColumn];

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <style>
        {`
          .ag-theme-alpine {
            --ag-row-height: 60px !important; /* Increase row height by 50% from default 40px */
          }
        `}
      </style>
      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={entities}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            editable: false,
            wrapHeaderText: true,
            autoHeaderHeight: true,
          }}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default EntityGrid;
