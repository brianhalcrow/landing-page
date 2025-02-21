
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export const AmountEditor = forwardRef((props: any, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    // Focus the input when the editor is mounted
    if (inputRef.current) {
      inputRef.current.focus();
      // Position cursor at the end of the input
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getValue() {
      return value ? parseFloat(value.toString().replace(/,/g, '')) : null;
    },

    isCancelBeforeStart() {
      return false;
    },

    isCancelAfterEnd() {
      return false;
    },
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, decimal point, and minus sign
    const newValue = event.target.value.replace(/[^\d.-]/g, '');
    setValue(newValue);
  };

  // Format the displayed value with commas
  const displayValue = value ? Number(value).toLocaleString() : '';

  return (
    <input
      ref={inputRef}
      className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-center"
      value={displayValue}
      type="text"
      onChange={handleChange}
    />
  );
});

AmountEditor.displayName = 'AmountEditor';
