
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export const AmountEditor = forwardRef((props: any, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const value = props.value;

  useEffect(() => {
    // Focus the input when the editor is mounted
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getValue() {
      return inputRef.current?.value ? parseFloat(inputRef.current.value.replace(/,/g, '')) : null;
    },

    isCancelBeforeStart() {
      return false;
    },

    isCancelAfterEnd() {
      return false;
    },
  }));

  return (
    <input
      ref={inputRef}
      className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-right pr-2"
      defaultValue={value}
      type="text"
      onChange={(event) => {
        const newValue = event.target.value.replace(/[^\d.-]/g, '');
        event.target.value = newValue;
      }}
    />
  );
});

AmountEditor.displayName = 'AmountEditor';
