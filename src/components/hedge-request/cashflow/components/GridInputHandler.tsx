
import { KeyboardEvent, RefObject } from 'react';

interface GridInputHandlerProps {
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
}

export const useGridInputHandler = ({ inputRefs }: GridInputHandlerProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const currentInput = event.currentTarget;
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        const upInput = inputRefs.current?.[colIndex];
        if (upInput) upInput.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        const downInput = inputRefs.current?.[colIndex + 12];
        if (downInput) downInput.focus();
        break;
      case 'ArrowLeft':
        if (currentInput.selectionStart === 0) {
          event.preventDefault();
          const prevInput = inputRefs.current?.[rowIndex * 12 + colIndex - 1];
          if (prevInput) prevInput.focus();
        }
        break;
      case 'ArrowRight':
        if (currentInput.selectionStart === currentInput.value.length) {
          event.preventDefault();
          const nextInput = inputRefs.current?.[rowIndex * 12 + colIndex + 1];
          if (nextInput) nextInput.focus();
        }
        break;
    }
  };

  return { handleKeyDown };
};
