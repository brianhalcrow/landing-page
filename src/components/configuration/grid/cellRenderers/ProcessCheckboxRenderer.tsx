
import { ICellRendererParams } from 'ag-grid-community';
import { Checkbox } from '@/components/ui/checkbox';

export const ProcessCheckboxRenderer = (params: ICellRendererParams) => {
  const isChecked = params.value === true || params.value === 'true';
  const isDisabled = !params.data?.isEditing;

  const handleChange = (checked: boolean) => {
    if (params.data?.isEditing) {
      params.setValue(checked);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={isChecked}
        disabled={isDisabled}
        onCheckedChange={handleChange}
      />
    </div>
  );
};
