import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxCellRendererProps {
  value?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxCellRenderer = ({ 
  value = false, 
  disabled = false, 
  onChange 
}: CheckboxCellRendererProps) => {
  // Add console logs for debugging
  console.log('CheckboxCellRenderer props:', { value, disabled });
  
  const handleChange = (checked: boolean | string) => {
    console.log('Checkbox change:', checked);
    onChange?.(!!checked);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox 
        checked={!!value}
        disabled={disabled}
        onCheckedChange={handleChange}
        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
      />
    </div>
  );
};

export default CheckboxCellRenderer;
