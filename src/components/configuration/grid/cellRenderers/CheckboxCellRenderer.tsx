
import React from 'react';

interface CheckboxCellRendererProps {
  value: boolean;
  disabled: boolean;
  onChange: (checked: boolean, data: any) => void;
  data: any;
}

const CheckboxCellRenderer: React.FC<CheckboxCellRendererProps> = ({ 
  value, 
  disabled, 
  onChange,
  data 
}) => {
  return (
    <input
      type="checkbox"
      checked={value || false}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked, data)}
      className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
    />
  );
};

export default CheckboxCellRenderer;
