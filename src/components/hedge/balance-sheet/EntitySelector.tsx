import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { EntityData } from "@/types/hedge-api";

interface EntitySelectorProps {
  instance: {
    selectedEntity: string;
    selectedEntityId: string;
    functionalCurrency: string;
  };
  entityData: EntityData[];
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
    <div className="flex gap-4 mb-6 items-end">
      <div>
        <Label>Entity</Label>
        <Select
          value={instance.selectedEntity}
          onValueChange={(value) => onEntityChange(value, index)}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select entity" />
          </SelectTrigger>
          <SelectContent>
            {entityData.map((entity: EntityData) => (
              <SelectItem 
                key={entity.entityId} 
                value={entity.entityName}
              >
                {entity.entityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Entity ID</Label>
        <Select
          value={instance.selectedEntityId}
          onValueChange={(value) => onEntityIdChange(value, index)}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="ID" />
          </SelectTrigger>
          <SelectContent>
            {entityData.map((entity: EntityData) => (
              <SelectItem 
                key={entity.entityId} 
                value={entity.entityId}
              >
                {entity.entityId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Functional Currency</Label>
        <Input
          value={instance.functionalCurrency}
          className="w-[120px]"
          readOnly
        />
      </div>
    </div>
  );
};