import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

interface CumulativeRowProps {
  label: string;
  values: string[];
  readOnly?: boolean;
  className?: string;
  showSubLabels?: boolean;
  onChange?: (index: number, value: string) => void;
  subLabel?: string;
  isRevenue?: boolean;
  isCost?: boolean;
}

export const CumulativeRow = ({ 
  label, 
  values, 
  readOnly = false, 
  className = "",
  showSubLabels = false,
  onChange,
  subLabel,
  isRevenue = false,
  isCost = false
}: CumulativeRowProps) => {
  const formatNumber = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return Math.round(num).toLocaleString();
  };

  const validateAndHandleChange = (index: number, value: string) => {
    if (!onChange) return;

    const numValue = parseFloat(value);
    
    if (value && !isNaN(numValue)) {
      if (isRevenue && numValue < 0) {
        toast({
          title: "Invalid Revenue",
          description: "Revenue must be greater than or equal to 0",
          variant: "destructive"
        });
        return;
      }
      
      if (isCost && numValue > 0) {
        toast({
          title: "Invalid Cost",
          description: "Cost must be less than or equal to 0",
          variant: "destructive"
        });
        return;
      }
    }

    onChange(index, value);
  };

  return (
    <div className={`grid grid-cols-[200px_repeat(12,minmax(60px,1fr))] gap-1 items-center ${className}`}>
      <div className="pl-2">
        <Label className="text-sm font-medium whitespace-nowrap block">
          {label}
        </Label>
        {showSubLabels && subLabel && (
          <Label className="text-xs text-gray-500 whitespace-nowrap block">
            {subLabel}
          </Label>
        )}
      </div>
      {values.map((value, index) => (
        <Input
          key={`${label}-${index}`}
          type="text"
          value={readOnly ? formatNumber(value) : value}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/,/g, '');
            validateAndHandleChange(index, rawValue);
          }}
          readOnly={readOnly}
          className={`h-8 text-sm px-2 ${readOnly ? 'bg-gray-50' : ''}`}
        />
      ))}
    </div>
  );
};