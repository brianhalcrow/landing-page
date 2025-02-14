
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { toast } from "sonner";
import { LegalEntity, PendingChanges, Counterparty } from "./types/entityTypes";
import { createBaseColumnDefs, createActionsColumn, createCounterpartyColumns } from "./columnDefs/entityColumns";
import { gridStyles } from "./styles/gridStyles";

const EntityGrid = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  // Fetch counterparties
  const { data: counterparties } = useQuery({
    queryKey: ["counterparties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counterparty")
        .select("*")
        .order("counterparty_name");

      if (error) throw error;
      return data as Counterparty[];
    },
  });

  // Fetch entities with their counterparty relationships
  const { data: entities, isLoading } = useQuery({
    queryKey: ["legal-entities-with-relationships"],
    queryFn: async () => {
      const { data: legalEntities, error: entityError } = await supabase
        .from("erp_legal_entity")
        .select("*")
        .order("entity_name");

      if (entityError) throw entityError;

      const { data: relationships, error: relationshipError } = await supabase
        .from("entity_counterparty")
        .select("*");

      if (relationshipError) throw relationshipError;

      return legalEntities.map((entity) => ({
        ...entity,
        exposure_configs: relationships
          .filter((rel) => rel.entity_id === entity.entity_id)
          .reduce((acc, rel) => ({
            ...acc,
            [rel.counterparty_id]: true,
          }), {}),
      }));
    },
  });

  // Batch update entity-counterparty relationships mutation
  const updateRelationshipsMutation = useMutation({
    mutationFn: async ({ 
      entityId, 
      changes 
    }: { 
      entityId: string; 
      changes: Record<string, boolean>;
    }) => {
      // Delete existing relationships for this entity
      const { error: deleteError } = await supabase
        .from("entity_counterparty")
        .delete()
        .eq("entity_id", entityId);

      if (deleteError) throw deleteError;

      // Insert new relationships
      const relationships = Object.entries(changes)
        .filter(([_, isActive]) => isActive)
        .map(([counterpartyId]) => ({
          entity_id: entityId,
          counterparty_id: counterpartyId,
          relationship_id: `${entityId}-${counterpartyId}`,
        }));

      if (relationships.length > 0) {
        const { error: insertError } = await supabase
          .from("entity_counterparty")
          .insert(relationships);

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legal-entities-with-relationships"] });
      toast.success("Relationships updated successfully");
    },
    onError: (error) => {
      console.error("Error updating relationships:", error);
      toast.error("Failed to update relationships");
    },
  });

  const handleEditClick = (entityId: string) => {
    setEditingRows(prev => ({
      ...prev,
      [entityId]: true
    }));
  };

  const handleSaveClick = (entityId: string) => {
    const changes = pendingChanges[entityId];
    if (changes) {
      updateRelationshipsMutation.mutate({
        entityId,
        changes,
      });
    }
    setEditingRows(prev => ({
      ...prev,
      [entityId]: false
    }));
    setPendingChanges(prev => {
      const newPending = { ...prev };
      delete newPending[entityId];
      return newPending;
    });
  };

  // Create column definitions
  const baseColumns = createBaseColumnDefs();
  const actionsColumn = createActionsColumn(editingRows, handleEditClick, handleSaveClick);
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
    {
      headerName: 'Type',
      children: counterpartyColumns
    } as ColGroupDef,
    actionsColumn
  ];

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="space-y-4">
      <style>{gridStyles}</style>
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
