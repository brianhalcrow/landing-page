
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PendingChanges = Record<string, Record<string, boolean>>;

export const useInstrumentsConfig = () => {
  const queryClient = useQueryClient();
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});

  const { data: counterparties, isLoading: loadingCounterparties } = useQuery({
    queryKey: ["counterparties"],
    queryFn: async () => {
      // First get all entity-counterparty relationships
      const { data: relationships, error: relError } = await supabase
        .from("entity_counterparty")
        .select("*");

      if (relError) throw relError;

      const { data, error } = await supabase
        .from("counterparty")
        .select("*")
        .order("counterparty_type", { ascending: false }) // This will put Internal first
        .order("country")
        .order("counterparty_name");

      if (error) throw error;
      
      // Filter counterparties to include:
      // 1. Those that have relationships with entities other than NL01
      // 2. Those that are Internal/NL/Sense Treasury B.V. (even if only linked to NL01)
      const filteredCounterparties = data.filter(cp => {
        const counterpartyRelationships = relationships.filter(
          rel => rel.counterparty_id === cp.counterparty_id
        );
        
        // Always include Sense Treasury if it's Internal/NL
        const isSenseTreasury = cp.counterparty_type === 'Internal' && 
                               cp.country === 'NL' && 
                               cp.counterparty_name === 'Sense Treasury B.V.';
        
        if (isSenseTreasury) {
          return true;
        }
        
        // For all other counterparties, include only if they have relationships
        // with entities other than NL01
        return counterpartyRelationships.some(rel => rel.entity_id !== 'NL01');
      });
      
      return filteredCounterparties.map(cp => ({
        ...cp,
        counterparty_type: cp.counterparty_type || "External"
      }));
    },
  });

  const { data: instruments, isLoading: loadingInstruments } = useQuery({
    queryKey: ["instruments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instruments")
        .select("*")
        .order("id");

      if (error) throw error;
      return data;
    },
  });

  const { data: instrumentConfigs, isLoading: loadingConfig } = useQuery({
    queryKey: ["counterparty-instruments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counterparty_instrument")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ counterpartyId, changes }: { counterpartyId: string; changes: Record<string, boolean> }) => {
      const updates = Object.entries(changes).map(([instrumentId, isActive]) => ({
        counterparty_id: counterpartyId,
        instrument_id: parseInt(instrumentId),
        is_active: isActive,
      }));

      const { error } = await supabase
        .from("counterparty_instrument")
        .upsert(updates, {
          onConflict: 'counterparty_id,instrument_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["counterparty-instruments"] });
      toast.success("Configuration saved successfully");
    },
  });

  const configData = counterparties?.map((counterparty) => {
    const instrumentMap = instrumentConfigs?.reduce((acc, config) => {
      if (config.counterparty_id === counterparty.counterparty_id) {
        acc[config.instrument_id] = config.is_active;
      }
      return acc;
    }, {} as Record<string, boolean>) || {};

    const pendingInstruments = pendingChanges[counterparty.counterparty_id] || {};

    return {
      ...counterparty,
      instruments: {
        ...instrumentMap,
        ...pendingInstruments,
      },
    };
  });

  const handleEditClick = (counterpartyId: string) => {
    setEditingRows(prev => ({
      ...prev,
      [counterpartyId]: true
    }));
  };

  const handleSaveClick = async (counterpartyId: string) => {
    try {
      const changes = pendingChanges[counterpartyId];
      if (changes) {
        await updateConfigMutation.mutateAsync({
          counterpartyId,
          changes,
        });
      }
      setEditingRows(prev => ({
        ...prev,
        [counterpartyId]: false
      }));
      setPendingChanges(prev => {
        const newPending = { ...prev };
        delete newPending[counterpartyId];
        return newPending;
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
  };

  return {
    counterparties,
    instruments: instruments || [],
    configData,
    isLoading: loadingCounterparties || loadingInstruments || loadingConfig,
    editingRows,
    pendingChanges,
    setPendingChanges,
    handleEditClick,
    handleSaveClick,
  };
};
