
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";

interface EntitySelectorProps {
  value: string;
  data: any;
  node: any;
}

export const EntitySelector = ({ value, data, node }: EntitySelectorProps) => {
  const { data: entities, isLoading } = useQuery({
    queryKey: ['legal-entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('erp_legal_entity')
        .select('entity_id, entity_name, functional_currency');

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <span>Loading...</span>;

  return (
    <div className="relative w-full">
      <select 
        value={value || ''} 
        onChange={(e) => {
          const selectedEntity = entities?.find(
            entity => entity.entity_name === e.target.value
          );
          if (selectedEntity && node.setData) {
            node.setData({
              ...data,
              entity_name: selectedEntity.entity_name,
              entity_id: selectedEntity.entity_id,
              functional_currency: selectedEntity.functional_currency
            });
          }
        }}
        className="w-full h-full border-0 outline-none bg-transparent appearance-none pr-8"
      >
        <option value="">Select Entity</option>
        {entities?.map((entity) => (
          <option key={entity.entity_id} value={entity.entity_name}>
            {entity.entity_name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none h-4 w-4" />
    </div>
  );
};
