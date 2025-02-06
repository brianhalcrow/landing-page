
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
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
    console.log('Checkbox change:', checked);
    onChange?.(!!checked);
  };

  const handleScheduleClick = () => {
    if (entityId && processSettingId) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Checkbox 
          checked={!!value}
          disabled={disabled}
          onCheckedChange={handleChange}
          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
        {hasSchedule && value && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleScheduleClick}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isModalOpen && entityId && processSettingId && (
        <ScheduleConfigurationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entityId={entityId}
          processSettingId={processSettingId}
        />
      )}
    </>
  );
};

export default CheckboxCellRenderer;
