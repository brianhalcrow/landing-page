
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "../components/FormSelect";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const RiskManagementSection = () => {
  const [description, setDescription] = useState("");
  const [economicRelationship, setEconomicRelationship] = useState("no");
  const [creditRiskImpact, setCreditRiskImpact] = useState("minimal");
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea 
            placeholder="Enter risk management objective and strategy description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="economicRelationship"
            checked={economicRelationship === "yes"}
            onCheckedChange={(checked) => 
              setEconomicRelationship(checked ? "yes" : "no")
            }
          />
          <Label htmlFor="economicRelationship">
            Economic Relationship Confirmed
          </Label>
        </div>

        <FormSelect
          label="Credit Risk Impact Assessment"
          options={[
            { value: "minimal", label: "Minimal" },
            { value: "significant", label: "Significant" },
          ]}
          value={creditRiskImpact}
          onChange={setCreditRiskImpact}
        />
      </div>
    </div>
  );
};

export default RiskManagementSection;
