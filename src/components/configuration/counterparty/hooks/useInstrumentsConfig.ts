
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PendingChanges = Record<string, Record<string, boolean>>;

export const useInstrumentsConfig = () => {
  const queryClient = useQueryClient();
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({});
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null);

  const { data: counterparties, isLoading: loadingCounterparties } = useQuery({
    queryKey: ["counterparties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counterparty")
        .select("*")
        .order("counterparty_type", { ascending: false })
        .order("country")
        .order("counterparty_name");

      if (error) throw error;
      return data.map(cp => ({
        ...cp,
        counterparty_type: cp.counterparty_type || "External",
        isEditing: false
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
    // Validate if there are any pending changes
    if (Object.keys(pendingChanges).length > 0) {
      toast.error("Please save pending changes before editing another row");
      return;
    }

    // Only allow editing if no other row is being edited
    if (!currentlyEditing || currentlyEditing === counterpartyId) {
      const updatedData = configData?.map(item => ({
        ...item,
        isEditing: item.counterparty_id === counterpartyId
      }));
      
      if (updatedData) {
        queryClient.setQueryData(["counterparties"], updatedData);
        setCurrentlyEditing(counterpartyId);
      }
    } else {
      toast.error("Please save your changes before editing another row");
    }
  };

  const handleSaveClick = async (counterpartyId: string) => {
    try {
      const changes = pendingChanges[counterpartyId];
      if (!changes) {
        toast.error("No changes to save");
        return;
      }

      await updateConfigMutation.mutateAsync({
        counterpartyId,
        changes,
      });

      const updatedData = configData?.map(item => ({
        ...item,
        isEditing: false
      }));
      
      if (updatedData) {
        queryClient.setQueryData(["counterparties"], updatedData);
      }

      setPendingChanges(prev => {
        const newPending = { ...prev };
        delete newPending[counterpartyId];
        return newPending;
      });
      
      setCurrentlyEditing(null);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return {
    counterparties,
    instruments: instruments || [],
    configData,
    isLoading: loadingCounterparties || loadingInstruments || loadingConfig,
    pendingChanges,
    setPendingChanges,
    handleEditClick,
    handleSaveClick,
    currentlyEditing,
    hasPendingChanges,
  };
};
