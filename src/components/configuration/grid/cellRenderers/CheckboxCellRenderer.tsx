
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
  const isEditing = props.data?.isEditing;

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
          "w-4 h-4 rounded border transition-colors",
          "focus:ring-2 focus:ring-blue-500",
          isEditing
            ? "accent-blue-500 border-blue-500 bg-white" // Active editing state
            : "accent-blue-600 border-blue-400 bg-blue-50", // Saved state with better contrast
          isDisabled && !isEditing && "cursor-not-allowed" // Removed opacity reduction
        )}
      />
    </div>
  );
};

export default CheckboxCellRenderer;
