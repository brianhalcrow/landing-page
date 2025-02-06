
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FrequencyType } from "../types/scheduleTypes";

interface FrequencySelectProps {
  value: FrequencyType;
  onChange: (value: FrequencyType) => void;
  disabled?: boolean;
}

const FrequencySelect = ({ value, onChange, disabled }: FrequencySelectProps) => {
  return (
    <div className="space-y-3">
      <Label>Frequency</Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as FrequencyType)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FrequencySelect;
