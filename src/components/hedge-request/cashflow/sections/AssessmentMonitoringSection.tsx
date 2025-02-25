
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "../components/FormSelect";
import { useState } from "react";

const AssessmentMonitoringSection = () => {
  const [details, setDetails] = useState("");
  const [effectivenessMethod, setEffectivenessMethod] = useState("");
  const [testingFrequency, setTestingFrequency] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <FormSelect
          label="Effectiveness Testing Method"
          options={[
            { value: "critical-terms", label: "Critical Terms Match" },
            { value: "dollar-offset", label: "Dollar Offset" },
            { value: "regression", label: "Regression" },
          ]}
          value={effectivenessMethod}
          onChange={setEffectivenessMethod}
        />

        <FormSelect
          label="Testing Frequency"
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
            { value: "annual", label: "Annual" },
          ]}
          value={testingFrequency}
          onChange={setTestingFrequency}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Assessment Details</label>
        <Textarea 
          placeholder="Enter hedge effectiveness assessment and monitoring details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default AssessmentMonitoringSection;
