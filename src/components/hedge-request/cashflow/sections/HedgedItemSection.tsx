
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [timePeriod, setTimePeriod] = useState("");
  const [probability, setProbability] = useState("");
  const [description, setDescription] = useState("");
  const [exposureCategories, setExposureCategories] = useState<string[]>([]);

  // Fetch exposure categories
  useEffect(() => {
    const fetchExposureCategories = async () => {
      const { data, error } = await supabase
        .from('exposure_types')
        .select('exposure_category_l2')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching exposure categories:', error);
        return;
      }

      const uniqueCategories = [...new Set(data.map(item => item.exposure_category_l2))];
      setExposureCategories(uniqueCategories);
    };

    fetchExposureCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Exposure Category L2</label>
          <Input 
            type="text" 
            value={exposureCategoryL2}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period</label>
          <Input 
            type="text" 
            placeholder="Enter time period" 
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Probability Assessment</label>
          <Select value={probability} onValueChange={setProbability}>
            <SelectTrigger>
              <SelectValue placeholder="Select probability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highly-probable">Highly Probable</SelectItem>
              <SelectItem value="probable">Probable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
