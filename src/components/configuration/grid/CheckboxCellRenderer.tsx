import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxCellRendererProps {
  value: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckboxCellRenderer = ({ value, disabled = false, onChange }: CheckboxCellRendererProps) => {
  return (
    <div className="flex items-center justify-center">
      <Checkbox 
        checked={!!value}
        disabled={disabled}
        onCheckedChange={(checked) => onChange?.(!!checked)}
      />
    </div>
  );
};

export default CheckboxCellRenderer;