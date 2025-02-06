
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScheduleType } from "../types/scheduleTypes";

interface ScheduleTypeSelectProps {
  value: ScheduleType;
  onChange: (value: ScheduleType) => void;
}

const ScheduleTypeSelect = ({ value, onChange }: ScheduleTypeSelectProps) => {
  return (
    <div className="space-y-3">
      <Label>Schedule Type</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as ScheduleType)}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="on_demand" id="on_demand" />
          <Label htmlFor="on_demand">On Demand</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="scheduled" id="scheduled" />
          <Label htmlFor="scheduled">Scheduled</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ScheduleTypeSelect;
