
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export const AmountEditor = forwardRef((props: any, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(props.value?.toString() || '');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getValue() {
      const numericValue = value ? parseFloat(value.replace(/[^\d.-]/g, '')) : null;
      return isNaN(numericValue) ? null : numericValue;
    },
    isCancelBeforeStart() {
      return false;
    },
    isCancelAfterEnd() {
      return false;
    },
  }));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^\d.-]/g, '');
    setValue(newValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
  };

  return (
    <input
      ref={inputRef}
      className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-center"
      value={value}
      type="text"
      onChange={handleChange}
    />
  );
});

AmountEditor.displayName = 'AmountEditor';
