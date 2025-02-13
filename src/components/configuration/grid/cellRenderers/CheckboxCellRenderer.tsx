
import { ICellRendererParams } from 'ag-grid-community';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxCellRendererProps extends ICellRendererParams {
  settingType: string;
  disabled?: boolean;
}

const CheckboxCellRenderer = ({ value, settingType, disabled }: CheckboxCellRendererProps) => {
  return (
    <div className="flex items-center justify-center">
      <Checkbox 
        checked={!!value} 
        disabled={disabled}
        onCheckedChange={() => {}}
      />
    </div>
  );
};

export default CheckboxCellRenderer;
