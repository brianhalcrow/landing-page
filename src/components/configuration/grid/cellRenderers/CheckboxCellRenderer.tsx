
import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';

interface CheckboxCellRendererProps extends ICellRendererParams {
  disabled?: boolean | ((params: any) => boolean);
  getValue?: () => boolean;
  onChange: (checked: boolean, data: any) => void;
}

const CheckboxCellRenderer = (props: CheckboxCellRendererProps) => {
  const isDisabled = typeof props.disabled === 'function' 
    ? props.disabled(props)
    : props.disabled || !props.data?.isEditing;

  const value = props.getValue ? props.getValue() : props.value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled && props.data) {
      props.onChange(e.target.checked, props.data);
    }
  };

  return (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={!!value}
        disabled={isDisabled}
        onChange={handleChange}
        className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
      />
    </div>
  );
};

export default CheckboxCellRenderer;
