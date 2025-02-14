import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
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
      const { data: legalEntities, error: entityError } = await supabase
        .from("erp_legal_entity")
        .select("*")
        .order("entity_name");

      if (entityError) throw entityError;

      const { data: exposureConfigs, error: configError } = await supabase
        .from("entity_exposure_config")
        .select("*");

      if (configError) throw configError;

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
  const baseColumnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: 'Entity Information',
      headerClass: 'header-center',
      children: [
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
      ]
    }
  ];

  // Create grouped exposure columns with three levels
  const groupedExposureColumns: ColGroupDef[] = exposureTypes?.reduce((acc: ColGroupDef[], type) => {
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
        disabled: (params: any) => !editingRows[params.data.entity_id],
        onChange: (isChecked: boolean, data: any) => {
          updateConfigMutation.mutate({
            entityId: data.entity_id,
            exposureTypeId: type.exposure_type_id,
            isActive: isChecked,
          });
        },
      },
    };

    l2Group.children?.push(l3Column);

    return acc;
  }, []) || [];

  // Add actions column
  const actionsColumn: ColDef = {
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
              setEditingRows(prev => ({
                ...prev,
                [params.data.entity_id]: !isEditing
              }));
              
              if (isEditing) {
                queryClient.invalidateQueries({ queryKey: ["legal-entities-with-config"] });
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
  };

  const columnDefs = [...baseColumnDefs, ...groupedExposureColumns, actionsColumn];

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <style>
        {`
          .ag-theme-alpine {
            --ag-header-height: auto !important;
            --ag-header-group-height: auto !important;
            --ag-row-height: 24px !important;
          }

          /* Base cell styles */
          .ag-cell {
            display: flex !important;
            align-items: center !important;
            height: 24px !important;
            padding: 0 16px !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          /* Header styles */
          .ag-header-cell {
            padding: 8px 0 !important;
            min-height: 50px !important;
          }

          .ag-header-cell.header-wrap {
            height: auto !important;
            min-height: 50px !important;
          }

          .ag-header-group-cell {
            font-weight: bold !important;
            height: auto !important;
            min-height: 50px !important;
            padding: 8px 0 !important;
          }

          /* Header alignment and wrapping */
          .header-center {
            text-align: center !important;
          }

          .header-center .ag-header-cell-label {
            justify-content: center !important;
            text-align: center !important;
          }

          .header-left {
            text-align: left !important;
          }

          .header-left .ag-header-cell-label {
            justify-content: flex-start !important;
            text-align: left !important;
            padding-left: 16px !important;
          }

          .header-wrap .ag-header-cell-label {
            white-space: normal !important;
            line-height: 1.2 !important;
            padding: 8px 4px !important;
            height: auto !important;
          }

          /* Cell alignment classes */
          .cell-center {
            justify-content: center !important;
          }

          .cell-left {
            justify-content: flex-start !important;
          }

          /* Action cell specific styles */
          .actions-cell {
            padding: 0 !important;
            justify-content: center !important;
          }

          /* Row styles */
          .ag-row {
            height: 24px !important;
          }

          .ag-row-group {
            height: 24px !important;
          }

          /* Checkbox specific styles */
          .ag-checkbox-input-wrapper {
            height: 16px !important;
            margin: 4px 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Button alignment in cells */
          .ag-cell .button {
            height: 20px !important;
            margin: 2px 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
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

export default EntityGrid;
