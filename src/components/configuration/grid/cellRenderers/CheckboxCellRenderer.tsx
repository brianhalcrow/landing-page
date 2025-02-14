
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
  const isDisabled = typeof props.disabled === 'function' ? props.disabled(props) : props.disabled;
  const value = typeof props.getValue === 'function' ? props.getValue() : props.value;
  
  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox 
        checked={!!value}
        disabled={isDisabled}
        onCheckedChange={(checked) => {
          if (!isDisabled) {
            props.onChange(!!checked, props.data);
          }
        }}
      />
    </div>
  );
};

export default CheckboxCellRenderer;
