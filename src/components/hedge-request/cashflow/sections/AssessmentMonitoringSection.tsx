
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import type { AssessmentMonitoringData } from "../types";

interface AssessmentMonitoringSectionProps {
  value?: AssessmentMonitoringData;
  onChange?: (value: AssessmentMonitoringData) => void;
}

const AssessmentMonitoringSection = ({ value, onChange }: AssessmentMonitoringSectionProps) => {
  const [assessmentDetails, setAssessmentDetails] = useState(value?.assessment_details || "");
  const [effectivenessMethod, setEffectivenessMethod] = useState(value?.effectiveness_testing_method || "");
  const [testingFrequency, setTestingFrequency] = useState(value?.testing_frequency || "");
  const [economicRelationship, setEconomicRelationship] = useState(value?.economic_relationship || "");
  const [creditRisk, setCreditRisk] = useState(value?.credit_risk_impact || "");
  const [reclassificationApproach, setReclassificationApproach] = useState(value?.oci_reclassification_approach || "");
  const [discontinuationCriteria, setDiscontinuationCriteria] = useState(value?.discontinuation_criteria || "");

  useEffect(() => {
    if (value) {
      console.log('AssessmentMonitoring - Updating from props:', value);
      setAssessmentDetails(value.assessment_details || "");
      setEffectivenessMethod(value.effectiveness_testing_method || "");
      setTestingFrequency(value.testing_frequency || "");
      setEconomicRelationship(value.economic_relationship || "");
      setCreditRisk(value.credit_risk_impact || "");
      setReclassificationApproach(value.oci_reclassification_approach || "");
      setDiscontinuationCriteria(value.discontinuation_criteria || "");
    }
  }, [value]);

  const handleChange = (field: keyof AssessmentMonitoringData, newValue: string) => {
    const updatedValue: AssessmentMonitoringData = {
      assessment_details: assessmentDetails,
      effectiveness_testing_method: effectivenessMethod,
      testing_frequency: testingFrequency,
      economic_relationship: economicRelationship,
      credit_risk_impact: creditRisk,
      oci_reclassification_approach: reclassificationApproach,
      discontinuation_criteria: discontinuationCriteria,
      [field]: newValue
    };

    switch (field) {
      case 'assessment_details':
        setAssessmentDetails(newValue);
        break;
      case 'effectiveness_testing_method':
        setEffectivenessMethod(newValue);
        break;
      case 'testing_frequency':
        setTestingFrequency(newValue);
        break;
      case 'economic_relationship':
        setEconomicRelationship(newValue);
        break;
      case 'credit_risk_impact':
        setCreditRisk(newValue);
        break;
      case 'oci_reclassification_approach':
        setReclassificationApproach(newValue);
        break;
      case 'discontinuation_criteria':
        setDiscontinuationCriteria(newValue);
        break;
    }

    onChange?.(updatedValue);
  };

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-6 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Effectiveness Testing Method</label>
          <Select 
            value={effectivenessMethod} 
            onValueChange={(value) => handleChange('effectiveness_testing_method', value)}
          >
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
          <Select 
            value={testingFrequency} 
            onValueChange={(value) => handleChange('testing_frequency', value)}
          >
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
          <Select 
            value={economicRelationship} 
            onValueChange={(value) => handleChange('economic_relationship', value)}
          >
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
          <Select 
            value={creditRisk} 
            onValueChange={(value) => handleChange('credit_risk_impact', value)}
          >
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
          <Select 
            value={reclassificationApproach} 
            onValueChange={(value) => handleChange('oci_reclassification_approach', value)}
          >
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
          <Select 
            value={discontinuationCriteria} 
            onValueChange={(value) => handleChange('discontinuation_criteria', value)}
          >
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
          onChange={(e) => handleChange('assessment_details', e.target.value)}
          rows={6}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default AssessmentMonitoringSection;
