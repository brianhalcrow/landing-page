import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxCellRendererProps {
  value: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxCellRenderer = ({ value, disabled = false, onChange }: CheckboxCellRendererProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox 
        checked={!!value}
        disabled={disabled}
        onCheckedChange={(checked) => onChange?.(!!checked)}
        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
      />
    </div>
  );
};

export default CheckboxCellRenderer;