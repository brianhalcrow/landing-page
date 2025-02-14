
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PendingChanges } from "../types/counterpartyTypes";

export const useCounterpartiesGrid = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  const { data: counterparties, isLoading: loadingCounterparties } = useQuery({
    queryKey: ["counterparties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counterparty")
        .select("*")
        .order("counterparty_name");

      if (error) throw error;
      return data;
    },
  });

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

  const updateRelationshipsMutation = useMutation({
    mutationFn: async ({ 
      entityId, 
      changes 
    }: { 
      entityId: string; 
      changes: Record<string, boolean>;
    }) => {
      const removedCounterparties = Object.keys(changes).filter(id => !changes[id]);
      
      if (removedCounterparties.length > 0) {
        const { error: deleteHedgeError } = await supabase
          .from("hedge_strategy_assignment")
          .delete()
          .eq("entity_id", entityId)
          .in("counterparty_id", removedCounterparties);

        if (deleteHedgeError) throw deleteHedgeError;
      }

      const { error: deleteError } = await supabase
        .from("entity_counterparty")
        .delete()
        .eq("entity_id", entityId);

      if (deleteError) throw deleteError;

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

  return {
    counterparties,
    gridData,
    isLoading: loadingCounterparties || loadingEntities,
    editingRows,
    pendingChanges,
    setPendingChanges,
    handleEditClick,
    handleSaveClick,
  };
};
