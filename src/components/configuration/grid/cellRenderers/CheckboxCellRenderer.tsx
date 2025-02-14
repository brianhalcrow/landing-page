
import { ICellRendererParams } from 'ag-grid-community';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxCellRendererProps extends ICellRendererParams {
  disabled?: (params: ICellRendererParams) => boolean;
  onChange: (checked: boolean, data: any) => void;
}

const CheckboxCellRenderer = (props: CheckboxCellRendererProps) => {
  const isDisabled = typeof props.disabled === 'function' ? props.disabled(props) : props.disabled;
  
  return (
    <div className="flex items-center justify-center h-full">
      <Checkbox 
        checked={!!props.value}
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
