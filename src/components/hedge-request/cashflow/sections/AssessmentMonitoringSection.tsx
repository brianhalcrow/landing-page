
import { Textarea } from "@/components/ui/textarea";

const AssessmentMonitoringSection = () => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Assessment Details</label>
        <Textarea 
          placeholder="Enter hedge effectiveness assessment and monitoring details"
          rows={4}
        />
      </div>
    </div>
  );
};

export default AssessmentMonitoringSection;
