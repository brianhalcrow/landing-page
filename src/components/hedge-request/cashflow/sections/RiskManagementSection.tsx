
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const RiskManagementSection = () => {
  const [description, setDescription] = useState("");
  
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter risk management objective and strategy description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RiskManagementSection;
