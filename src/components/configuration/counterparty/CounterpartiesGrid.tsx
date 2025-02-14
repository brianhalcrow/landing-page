
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { toast } from "sonner";
import { LegalEntity, Counterparty, EntityCounterparty, PendingChanges } from "./types/counterpartyTypes";
import { createBaseColumnDefs, createCounterpartyColumns } from "./columnDefs/counterpartyColumns";
import { gridStyles } from "./styles/gridStyles";
import ActionsCellRenderer from "../grid/ActionsCellRenderer";

const CounterpartiesGrid = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  // Fetch counterparties
  const { data: counterparties, isLoading: loadingCounterparties } = useQuery({
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

  // Fetch entities with their relationships, excluding NL01
  const { data: gridData, isLoading: loadingEntities } = useQuery({
    queryKey: ["entities-with-relationships"],
    queryFn: async () => {
      const { data: entities, error: entitiesError } = await supabase
        .from("erp_legal_entity")
        .select("entity_id, entity_name")
        .neq('entity_id', 'NL01')
        .order("entity_name");

      if (entitiesError) throw entitiesError;

      const { data: relationships, error: relationshipsError } = await supabase
        .from("entity_counterparty")
        .select("*");

      if (relationshipsError) throw relationshipsError;

      // Fetch hedge strategy assignments
      const { data: hedgeAssignments, error: hedgeError } = await supabase
        .from("hedge_strategy_assignment")
        .select("*");

      if (hedgeError) throw hedgeError;

      return entities.map((entity) => ({
        ...entity,
        relationships: relationships
          .filter((rel) => rel.entity_id === entity.entity_id)
          .reduce((acc, rel) => ({
            ...acc,
            [rel.counterparty_id]: true,
          }), {}),
        hedgeAssignments: hedgeAssignments
          .filter((assignment) => assignment.entity_id === entity.entity_id)
          .reduce((acc, assignment) => ({
            ...acc,
            [assignment.counterparty_id]: assignment.hedge_strategy_id,
          }), {}),
      }));
    },
  });

  // Update relationships mutation
  const updateRelationshipsMutation = useMutation({
    mutationFn: async ({ 
      entityId, 
      changes 
    }: { 
      entityId: string; 
      changes: Record<string, boolean>;
    }) => {
      // Start by handling hedge strategy assignments
      const removedCounterparties = Object.keys(changes).filter(id => !changes[id]);
      
      // Delete hedge strategy assignments for removed relationships
      if (removedCounterparties.length > 0) {
        const { error: deleteHedgeError } = await supabase
          .from("hedge_strategy_assignment")
          .delete()
          .eq("entity_id", entityId)
          .in("counterparty_id", removedCounterparties);

        if (deleteHedgeError) throw deleteHedgeError;
      }

      // Then delete existing relationships for this entity
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
      queryClient.invalidateQueries({ queryKey: ["entities-with-relationships"] });
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

  if (loadingCounterparties || loadingEntities) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  // Create column definitions
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
        onEditClick: () => handleEditClick(params.data?.entity_id),
        onSaveClick: () => handleSaveClick(params.data?.entity_id),
      }),
      headerClass: 'header-center',
      cellClass: 'cell-center'
    },
  ];

  return (
    <div className="space-y-4">
      <style>{gridStyles}</style>
      <div className="w-full h-[600px] ag-theme-alpine">
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

export default CounterpartiesGrid;
