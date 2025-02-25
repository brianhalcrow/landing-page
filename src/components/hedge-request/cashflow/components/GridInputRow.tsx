
import { Input } from "@/components/ui/input";
import { KeyboardEvent } from "react";

interface GridInputRowProps {
  label: string;
  sublabel: string;
  values: Record<number, number>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => void;
  rowIndex: number;
  monthCount: number;
  inputRefs: (HTMLInputElement | null)[];
  refStartIndex: number;
  formatValue?: (value: number) => string;
  readOnly?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const GridInputRow = ({
  label,
  sublabel,
  values,
  onChange,
  onKeyDown,
  rowIndex,
  monthCount,
  inputRefs,
  refStartIndex,
  formatValue = (v) => v.toString(),
  readOnly = false,
  onFocus,
}: GridInputRowProps) => {
  const baseInputStyles = "text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2 mb-2">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-gray-600">{sublabel}</div>
      </div>
      {Array(monthCount).fill(null).map((_, i) => (
        readOnly ? (
          <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
            {formatValue(values[i] || 0)}
          </div>
        ) : (
          <Input 
            key={i}
            type="text"
            className={baseInputStyles}
            value={values[i] ? formatValue(values[i]) : ''}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(e, rowIndex, i)}
            ref={el => inputRefs[refStartIndex + i] = el}
            onFocus={onFocus}
          />
        )
      ))}
    </div>
  );
};
