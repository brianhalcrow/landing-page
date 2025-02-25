
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Entity } from "../hooks/useEntityData";

interface HedgingEntityFieldsProps {
  selectedHedgingEntity: string;
  onHedgingEntityChange: (value: string) => void;
  hedgingEntityFunctionalCurrency: string;
  availableHedgingEntities: Entity[] | null;
}

export const HedgingEntityFields = ({
  selectedHedgingEntity,
  onHedgingEntityChange,
  hedgingEntityFunctionalCurrency,
  availableHedgingEntities
}: HedgingEntityFieldsProps) => {
  return (
    <>
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
    </>
  );
};
