
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Entity } from "@/types/hedge-api";

interface EntitySelectorProps {
  instance: {
    selectedEntity: string;
    selectedEntityId: string;
    functionalCurrency: string;
  };
  entityData: Entity[];
  index: number;
  onEntityChange: (value: string, index: number) => void;
  onEntityIdChange: (value: string, index: number) => void;
}

export const EntitySelector = ({
  instance,
  entityData,
  index,
  onEntityChange,
  onEntityIdChange,
}: EntitySelectorProps) => {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label className="mb-2 block">Entity Name</Label>
        <Select
          value={instance.selectedEntity}
          onValueChange={(value) => onEntityChange(value, index)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select entity" />
          </SelectTrigger>
          <SelectContent>
            {entityData.map((entity) => (
              <SelectItem key={entity.entityId} value={entity.entityName}>
                {entity.entityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Label className="mb-2 block">Entity ID</Label>
        <Select
          value={instance.selectedEntityId}
          onValueChange={(value) => onEntityIdChange(value, index)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select ID" />
          </SelectTrigger>
          <SelectContent>
            {entityData.map((entity) => (
              <SelectItem key={entity.entityId} value={entity.entityId}>
                {entity.entityId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
