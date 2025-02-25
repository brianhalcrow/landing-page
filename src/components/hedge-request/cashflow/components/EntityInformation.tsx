
import { EntityData } from "../hooks/useEntityData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EntityInformationProps {
  entities: EntityData[] | null;
  selectedEntityId: string;
  selectedEntityName: string;
  onEntityChange: (entityId: string, entityName: string) => void;
  selectedHedgingEntity: string;
  onHedgingEntityChange: (entityName: string) => void;
  hedgingEntityFunctionalCurrency: string;
  availableHedgingEntities: EntityData[] | null;
}

export const EntityInformation = ({
  entities,
  selectedEntityId,
  selectedEntityName,
  onEntityChange,
  selectedHedgingEntity,
  onHedgingEntityChange,
  hedgingEntityFunctionalCurrency,
  availableHedgingEntities,
}: EntityInformationProps) => {
  const { data: costCentres } = useQuery({
    queryKey: ['cost-centres', selectedEntityId],
    queryFn: async () => {
      if (!selectedEntityId) return [];
      
      const { data: centresData, error } = await supabase
        .from('erp_mgmt_structure')
        .select('cost_centre')
        .eq('entity_id', selectedEntityId.trim());

      if (error) {
        console.error('Error fetching cost centres:', error);
        throw error;
      }

      if (!centresData || !Array.isArray(centresData)) {
        return [];
      }

      const validCentres = centresData
        .map(item => item.cost_centre)
        .filter(Boolean)
        .sort();

      return [...new Set(validCentres)];
    },
    enabled: !!selectedEntityId
  });

  const handleEntityNameChange = (entityName: string) => {
    const entity = entities?.find(e => e.entity_name === entityName);
    if (entity) {
      onEntityChange(entity.entity_id, entityName);
    }
  };

  const handleEntityIdChange = (entityId: string) => {
    const entity = entities?.find(e => e.entity_id === entityId);
    if (entity) {
      onEntityChange(entityId, entity.entity_name);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge ID</label>
        <Input type="text" placeholder="Enter hedge ID" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Entity Name</label>
        <Select value={selectedEntityName} onValueChange={handleEntityNameChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select entity" />
          </SelectTrigger>
          <SelectContent>
            {entities?.map(entity => (
              <SelectItem key={entity.entity_id} value={entity.entity_name}>
                {entity.entity_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Entity ID</label>
        <Select value={selectedEntityId} onValueChange={handleEntityIdChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select entity ID" />
          </SelectTrigger>
          <SelectContent>
            {entities?.map(entity => (
              <SelectItem key={entity.entity_id} value={entity.entity_id}>
                {entity.entity_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cost Centre</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {costCentres?.map(centre => (
              <SelectItem key={centre} value={centre}>
                {centre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity</label>
        <Select value={selectedHedgingEntity} onValueChange={onHedgingEntityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select hedging entity" />
          </SelectTrigger>
          <SelectContent>
            {availableHedgingEntities?.map(entity => (
              <SelectItem key={entity.entity_id} value={entity.entity_name}>
                {entity.entity_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity Functional Currency</label>
        <Input 
          type="text" 
          value={hedgingEntityFunctionalCurrency} 
          disabled
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Functional Currency</label>
        <Input 
          type="text" 
          value={entities?.find(e => e.entity_id === selectedEntityId)?.functional_currency || ''} 
          disabled
          className="bg-gray-100"
        />
      </div>
    </>
  );
};
