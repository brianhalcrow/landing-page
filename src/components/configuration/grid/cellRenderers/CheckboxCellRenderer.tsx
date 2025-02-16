import React from "react";
import { ICellRendererParams } from "ag-grid-enterprise";

interface CheckboxCellRendererProps extends ICellRendererParams {
  disabled?: boolean | ((params: any) => boolean);
  getValue?: () => boolean;
  onChange: (checked: boolean, data: any) => void;
}

const CheckboxCellRenderer = (props: CheckboxCellRendererProps) => {
  const isDisabled =
    typeof props.disabled === "function"
      ? props.disabled(props)
      : props.disabled || !props.data?.isEditing;

  const value = props.getValue ? props.getValue() : props.value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled && props.data) {
      props.onChange(e.target.checked, props.data);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <input
        type="checkbox"
        checked={!!value}
        disabled={isDisabled}
        onChange={handleChange}
        className="ag-checkbox-input"
        ref={(el) => {
          if (el) {
            el.style.setProperty(
              "--ag-checkbox-checked-color",
              "var(--ag-material-primary-color)"
            );
            el.style.setProperty(
              "--ag-input-focus-border-color",
              "var(--ag-material-primary-color)"
            );
            el.style.setProperty(
              "--ag-checkbox-background-color",
              "var(--ag-background-color)"
            );
            el.style.setProperty(
              "--ag-checkbox-unchecked-color",
              "var(--ag-secondary-foreground-color)"
            );
          }
        }}
      />
    </div>
  );
};

export default CheckboxCellRenderer;
