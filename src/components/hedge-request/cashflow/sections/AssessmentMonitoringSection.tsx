
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "../components/FormSelect";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AssessmentMonitoringSection = () => {
  const [details, setDetails] = useState("");
  const [effectivenessMethod, setEffectivenessMethod] = useState("");
  const [ineffectivenessSources, setIneffectivenessSources] = useState("");
  const [testingFrequency, setTestingFrequency] = useState("");
  const [reclassificationApproach, setReclassificationApproach] = useState("");
  const [entriesDocumented, setEntriesDocumented] = useState(false);
  const [discontinuationCriteria, setDiscontinuationCriteria] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Assessment Details</label>
          <Textarea 
            placeholder="Enter hedge effectiveness assessment and monitoring details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <label className="text-sm font-medium">Key Sources of Ineffectiveness</label>
          <Textarea 
            placeholder="Enter key sources of ineffectiveness"
            value={ineffectivenessSources}
            onChange={(e) => setIneffectivenessSources(e.target.value)}
            rows={2}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Accounting Treatment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormSelect
              label="OCI Reclassification Approach"
              options={[
                { value: "basis-adjustment", label: "Basis Adjustment" },
                { value: "direct-transfer", label: "Direct Transfer to P&L" },
                { value: "other", label: "Other" },
              ]}
              value={reclassificationApproach}
              onChange={setReclassificationApproach}
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="entriesDocumented"
                checked={entriesDocumented}
                onCheckedChange={(checked) => 
                  setEntriesDocumented(checked as boolean)
                }
              />
              <Label htmlFor="entriesDocumented">
                Accounting Entries Documented
              </Label>
            </div>
          </CardContent>
        </Card>

        <FormSelect
          label="Discontinuation Criteria"
          options={[
            { value: "no-criteria", label: "Hedge no longer meets criteria" },
            { value: "not-probable", label: "Forecasted transaction no longer probable" },
            { value: "terminated", label: "Hedge relationship terminated" },
            { value: "other", label: "Other" },
          ]}
          value={discontinuationCriteria}
          onChange={setDiscontinuationCriteria}
        />
      </div>
    </div>
  );
};

export default AssessmentMonitoringSection;
