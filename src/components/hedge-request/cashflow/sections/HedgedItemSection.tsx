
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface HedgedItemSectionProps {
  exposureCategoryL2: string;
  onExposureCategoryL2Change: (value: string) => void;
  selectedStrategy: string;
}

const HedgedItemSection = ({ 
  exposureCategoryL2, 
  onExposureCategoryL2Change,
  selectedStrategy
}: HedgedItemSectionProps) => {
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter hedged item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default HedgedItemSection;
