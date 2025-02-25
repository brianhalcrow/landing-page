
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
  onEntityChange: (entityName: string) => void;
}

export const EntityInformation = ({
  entities,
  selectedEntityId,
  selectedEntityName,
  onEntityChange,
}: EntityInformationProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Hedge ID</label>
        <Input type="text" placeholder="Enter hedge ID" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Entity Name</label>
        <Select value={selectedEntityName} onValueChange={onEntityChange}>
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
        <Input 
          type="text" 
          value={selectedEntityId} 
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
