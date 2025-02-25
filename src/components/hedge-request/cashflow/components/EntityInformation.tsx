
import { EntityData } from "../hooks/useEntityData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
        <Input type="text" placeholder="Enter cost centre" />
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
