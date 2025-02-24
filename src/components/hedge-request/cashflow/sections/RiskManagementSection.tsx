
import { Textarea } from "@/components/ui/textarea";

const RiskManagementSection = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter risk management objective and strategy description"
          rows={4}
        />
      </div>
    </div>
  );
};

export default RiskManagementSection;
