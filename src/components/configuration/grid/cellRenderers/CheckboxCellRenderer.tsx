
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface CheckboxCellRendererProps {
  value?: boolean;
  disabled?: boolean;
}

const CheckboxCellRenderer = ({ 
  value = false, 
  disabled = false 
}: CheckboxCellRendererProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Checkbox 
                checked={value}
                disabled={disabled}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{value ? 'Enabled' : 'Disabled'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default CheckboxCellRenderer;
