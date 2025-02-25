
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const AssessmentMonitoringSection = () => {
  const [assessmentDetails, setAssessmentDetails] = useState("");
  const [effectivenessMethod, setEffectivenessMethod] = useState("");
  const [testingFrequency, setTestingFrequency] = useState("");
  const [economicRelationship, setEconomicRelationship] = useState("");
  const [creditRisk, setCreditRisk] = useState("");
  const [reclassificationApproach, setReclassificationApproach] = useState("");
  const [discontinuationCriteria, setDiscontinuationCriteria] = useState("");

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-6 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Effectiveness Testing Method</label>
          <Select value={effectivenessMethod} onValueChange={setEffectivenessMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dollar-offset">Dollar Offset</SelectItem>
              <SelectItem value="regression">Regression Analysis</SelectItem>
              <SelectItem value="sensitivity">Sensitivity Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Testing Frequency</label>
          <Select value={testingFrequency} onValueChange={setTestingFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="semi-annual">Semi-Annual</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Economic Relationship</label>
          <Select value={economicRelationship} onValueChange={setEconomicRelationship}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="inverse">Inverse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Credit Risk Impact</label>
          <Select value={creditRisk} onValueChange={setCreditRisk}>
            <SelectTrigger>
              <SelectValue placeholder="Select impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">OCI Reclassification</label>
          <Select value={reclassificationApproach} onValueChange={setReclassificationApproach}>
            <SelectTrigger>
              <SelectValue placeholder="Select approach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basis-adjustment">Basis Adjustment</SelectItem>
              <SelectItem value="direct-transfer">Direct Transfer to P&L</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Discontinuation Criteria</label>
          <Select value={discontinuationCriteria} onValueChange={setDiscontinuationCriteria}>
            <SelectTrigger>
              <SelectValue placeholder="Select criteria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-criteria">Hedge no longer meets criteria</SelectItem>
              <SelectItem value="not-probable">Forecasted transaction no longer probable</SelectItem>
              <SelectItem value="terminated">Hedge relationship terminated</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 w-full">
        <label className="text-sm font-medium">Assessment Details</label>
        <Textarea 
          placeholder="Enter assessment details"
          value={assessmentDetails}
          onChange={(e) => setAssessmentDetails(e.target.value)}
          rows={6}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AssessmentMonitoringSection;
