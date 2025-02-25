
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

const HedgedItemSection = () => {
  const [type, setType] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [probability, setProbability] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Hedged Item Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forecast">Forecast Transaction</SelectItem>
              <SelectItem value="firm">Firm Commitment</SelectItem>
            </SelectContent>
          </Select>
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
