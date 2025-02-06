
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface DaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  type: 'week' | 'month';
  disabled?: boolean;
}

const DaySelector = ({ selectedDays, onChange, type, disabled }: DaySelectorProps) => {
  const days = type === 'week' 
    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleDayToggle = (day: number) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    onChange(newDays);
  };

  return (
    <div className="space-y-3">
      <Label>{type === 'week' ? 'Days of Week' : 'Days of Month'}</Label>
      <div className="grid grid-cols-4 gap-2">
        {days.map((day, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Checkbox
              id={`day-${index}`}
              checked={selectedDays.includes(index)}
              onCheckedChange={() => handleDayToggle(index)}
              disabled={disabled}
            />
            <Label htmlFor={`day-${index}`}>{day}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaySelector;
