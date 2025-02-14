
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PendingChanges = Record<string, Record<string, boolean>>;

export const useInstrumentsConfig = () => {
  const queryClient = useQueryClient();
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
    mutationFn: async (changes: PendingChanges) => {
      const updates = [];

      for (const [counterpartyId, instruments] of Object.entries(changes)) {
        for (const [instrumentId, isActive] of Object.entries(instruments)) {
          updates.push({
            counterparty_id: counterpartyId,
            instrument_id: parseInt(instrumentId),
            is_active: isActive,
          });
        }
      }

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

  const saveChanges = async () => {
    await updateConfigMutation.mutateAsync(pendingChanges);
    setPendingChanges({});
  };

  return {
    counterparties,
    instruments: instruments || [],
    configData,
    isLoading: loadingCounterparties || loadingInstruments || loadingConfig,
    pendingChanges,
    setPendingChanges,
    saveChanges,
  };
};
