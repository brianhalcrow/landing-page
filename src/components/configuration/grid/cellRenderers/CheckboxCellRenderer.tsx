
import { ICellRendererParams } from 'ag-grid-community';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxCellRendererProps {
  disabled?: boolean | ((params: ICellRendererParams) => boolean);
  value?: boolean;
  data?: any;
  getValue?: () => any;
  onChange: (checked: boolean, data: any) => void;
}

const CheckboxCellRenderer = (props: ICellRendererParams & CheckboxCellRendererProps) => {
  // Add null checks for all property accesses
  const isDisabled = props.disabled ? 
    (typeof props.disabled === 'function' ? props.disabled(props) : props.disabled) 
    : false;
  
  // Safely access getValue with a fallback chain
  const getValue = () => {
    if (typeof props.getValue === 'function') {
      try {
        return props.getValue();
      } catch (e) {
        console.warn('Error in getValue:', e);
        return props.value;
      }
    }
    return props.value;
  };

  const value = getValue();
  
  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox 
        checked={!!value}
        disabled={isDisabled}
        onCheckedChange={(checked) => {
          if (!isDisabled && props.data) {
            props.onChange(!!checked, props.data);
          }
        }}
      />
    </div>
  );
};

export default CheckboxCellRenderer;
