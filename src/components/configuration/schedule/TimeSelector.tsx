
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface TimeSelectorProps {
  times: string[];
  onChange: (times: string[]) => void;
  disabled?: boolean;
}

const TimeSelector = ({ times, onChange, disabled }: TimeSelectorProps) => {
  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    onChange(newTimes);
  };

  const handleAddTime = () => {
    onChange([...times, '00:00']);
  };

  const handleRemoveTime = (index: number) => {
    const newTimes = times.filter((_, i) => i !== index);
    onChange(newTimes);
  };

  return (
    <div className="space-y-3">
      <Label>Execution Times</Label>
      <div className="space-y-2">
        {times.map((time, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(index, e.target.value)}
              disabled={disabled}
              className="w-32"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTime(index)}
              disabled={disabled || times.length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddTime}
          disabled={disabled}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Time
        </Button>
      </div>
    </div>
  );
};

export default TimeSelector;
