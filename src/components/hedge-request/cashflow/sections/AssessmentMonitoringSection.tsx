
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

interface AssessmentMonitoringSectionProps {
  exposureCategoryL2?: string;
  instrumentType?: string;
}

const AssessmentMonitoringSection = ({ 
  exposureCategoryL2,
  instrumentType
}: AssessmentMonitoringSectionProps) => {
  const [forwardElement, setForwardElement] = useState("");
  const [currencyBasis, setCurrencyBasis] = useState("");
  const [assessmentDetails, setAssessmentDetails] = useState("");
  const [testingFrequency, setTestingFrequency] = useState("");
  const [effectivenessMethod, setEffectivenessMethod] = useState("");
  const [economicRelationship, setEconomicRelationship] = useState("");
  const [creditRisk, setCreditRisk] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Exposure Category L2</label>
          <Input
            value={exposureCategoryL2 || ''}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Instrument Type</label>
          <Input
            value={instrumentType || ''}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Forward Element Designation</label>
          <Select value={forwardElement} onValueChange={setForwardElement}>
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="included">Included</SelectItem>
              <SelectItem value="excluded">Excluded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Foreign Currency Basis Spreads</label>
          <Select value={currencyBasis} onValueChange={setCurrencyBasis}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="included">Included</SelectItem>
              <SelectItem value="excluded">Excluded</SelectItem>
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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Assessment Details</label>
        <Textarea 
          placeholder="Enter assessment details"
          value={assessmentDetails}
          onChange={(e) => setAssessmentDetails(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default AssessmentMonitoringSection;
