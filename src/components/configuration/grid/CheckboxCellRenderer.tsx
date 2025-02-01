// CheckboxCellRenderer.tsx
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
  const handleChange = (checked: boolean | string) => {
    onChange?.(!!checked);
  };

  return (
    <div 
      className="ag-cell-wrapper ag-cell-wrapper-center" 
      style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
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
