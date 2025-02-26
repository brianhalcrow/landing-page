
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EntityData {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
}

export type Entity = EntityData; // Alias for clarity when used in components

export const TREASURY_COUNTERPARTY_ID = 'SEN1';
export const TREASURY_ENTITY_NAME = 'Sense Treasury Centre B.V.';

export const useEntityData = (selectedEntityId: string) => {
  const { data: entities } = useQuery({
    queryKey: ['legal-entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('erp_legal_entity')
        .select('entity_id, entity_name, functional_currency');
      
      if (error) throw error;
      return data as EntityData[];
    }
  });

  const { data: entityCounterparty, isSuccess: isRelationshipsFetched } = useQuery({
    queryKey: ['entity-counterparty', selectedEntityId],
    queryFn: async () => {
      if (!selectedEntityId) return null;
      const { data, error } = await supabase
        .from('entity_counterparty')
        .select('*')
        .eq('entity_id', selectedEntityId)
        .eq('counterparty_id', TREASURY_COUNTERPARTY_ID);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedEntityId
  });

  return {
    entities,
    entityCounterparty,
    isRelationshipsFetched
  };
};
