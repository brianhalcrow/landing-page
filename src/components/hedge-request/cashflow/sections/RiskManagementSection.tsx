
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "../components/FormSelect";
import { useState } from "react";

const RiskManagementSection = () => {
  const [description, setDescription] = useState("");
  const [economicRelationship, setEconomicRelationship] = useState("");
  const [creditRiskImpact, setCreditRiskImpact] = useState("minimal");
  const [reclassificationApproach, setReclassificationApproach] = useState("");
  const [discontinuationCriteria, setDiscontinuationCriteria] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <FormSelect
          label="Credit Risk Impact Assessment"
          options={[
            { value: "minimal", label: "Minimal" },
            { value: "significant", label: "Significant" },
          ]}
          value={creditRiskImpact}
          onChange={setCreditRiskImpact}
        />

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

        <FormSelect
          label="Economic Relationship"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          value={economicRelationship}
          onChange={setEconomicRelationship}
        />

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

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter risk management objective and strategy description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default RiskManagementSection;
