
import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { cn } from "@/lib/utils";

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
        className={cn(
          "w-4 h-4 rounded transition-colors",
          isDisabled
            ? value 
              ? "bg-blue-100 border-blue-200 checked:bg-blue-100" // Light blue when saved
              : "bg-gray-100 border-gray-200"  // Gray when unchecked
            : "border-blue-500 checked:bg-blue-500 checked:border-blue-500" // Dark blue when editing
        )}
      />
    </div>
  );
};

export default CheckboxCellRenderer;
