
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface HedgedItemSectionProps {
  exposureCategoryL2: string;
  onExposureCategoryL2Change: (value: string) => void;
  selectedStrategy: string;
  value?: string;
  onChange?: (value: string) => void;
}

const HedgedItemSection = ({ 
  exposureCategoryL2, 
  onExposureCategoryL2Change,
  selectedStrategy,
  value,
  onChange
}: HedgedItemSectionProps) => {
  const [description, setDescription] = useState(value || "");

  useEffect(() => {
    setDescription(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter hedged item description"
          value={description}
          onChange={handleChange}
          rows={6}
        />
      </div>
    </div>
  );
};

export default HedgedItemSection;
