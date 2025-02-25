
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface RiskManagementSectionProps {
  value?: string;
  onChange?: (value: string) => void;
}

const RiskManagementSection = ({ value, onChange }: RiskManagementSectionProps) => {
  const [description, setDescription] = useState(value || "");
  
  useEffect(() => {
    setDescription(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    onChange?.(e.target.value);
  };
  
  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2 w-full">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter risk management objective and strategy description"
          value={description}
          onChange={handleChange}
          rows={6}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RiskManagementSection;
