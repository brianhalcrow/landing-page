import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface CheckboxCellRendererProps {
  value?: boolean;
  disabled?: boolean;
  hasSchedule?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxCellRenderer = ({ 
  value = false, 
  disabled = false,
  hasSchedule = false,
  onChange 
}: CheckboxCellRendererProps) => {
  const handleChange = (checked: boolean | string) => {
    console.log('Checkbox change:', checked);
    onChange?.(!!checked);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Checkbox 
        checked={!!value}
        disabled={disabled}
        onCheckedChange={handleChange}
        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
      />
      {hasSchedule && value && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => console.log('Configure schedule')}
        >
          <Calendar className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CheckboxCellRenderer;
