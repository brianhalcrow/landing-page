
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const HedgedItemSection = () => {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-3 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hedged Item Type</label>
            <Select>
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
            <Input type="text" placeholder="Enter time period" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Probability Assessment</label>
            <Select>
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
      </div>

      <div className="col-span-2 space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter hedged item description"
          className="h-full min-h-[180px] resize-none"
        />
      </div>
    </div>
  );
};

export default HedgedItemSection;
