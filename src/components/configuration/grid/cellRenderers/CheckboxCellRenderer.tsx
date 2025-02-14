
import { ICellRendererParams } from 'ag-grid-community';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxCellRendererProps extends Omit<ICellRendererParams, 'getValue'> {
  disabled?: (params: ICellRendererParams) => boolean;
  getValue?: (params: ICellRendererParams) => boolean;
  onChange: (checked: boolean, data: any) => void;
}

const CheckboxCellRenderer = (props: CheckboxCellRendererProps) => {
  const isDisabled = typeof props.disabled === 'function' ? props.disabled(props) : props.disabled;
  const value = props.getValue ? props.getValue(props) : props.value;
  
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
