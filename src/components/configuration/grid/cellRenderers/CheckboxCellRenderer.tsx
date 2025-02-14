
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
          "w-4 h-4 rounded transition-colors focus:ring-2 focus:ring-blue-500",
          isDisabled
            ? "accent-blue-300 bg-blue-50 border-blue-200" // Lighter blue for disabled/saved state
            : "accent-blue-500 border-blue-500" // Darker blue for editing state
        )}
      />
    </div>
  );
};

export default CheckboxCellRenderer;
