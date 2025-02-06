
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ScheduleConfigurationModal from "../../modals/ScheduleConfigurationModal";

interface CheckboxCellRendererProps {
  value?: boolean;
  disabled?: boolean;
  hasSchedule?: boolean;
  entityId?: string;
  processSettingId?: number;
  onChange?: (checked: boolean) => void;
}

const CheckboxCellRenderer = ({ 
  value = false, 
  disabled = false,
  hasSchedule = false,
  entityId,
  processSettingId,
  onChange 
}: CheckboxCellRendererProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (checked: boolean | string) => {
    onChange?.(!!checked);
  };

  const handleScheduleClick = () => {
    if (entityId && processSettingId) {
      setIsModalOpen(true);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Checkbox 
                checked={!!value}
                disabled={disabled}
                onCheckedChange={handleChange}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{value ? 'Enabled' : 'Disabled'}</p>
          </TooltipContent>
        </Tooltip>

        {hasSchedule && value && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleScheduleClick}
                data-testid="schedule-button"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configure Schedule</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isModalOpen && entityId && processSettingId && (
          <ScheduleConfigurationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            entityId={entityId}
            processSettingId={processSettingId}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default CheckboxCellRenderer;
