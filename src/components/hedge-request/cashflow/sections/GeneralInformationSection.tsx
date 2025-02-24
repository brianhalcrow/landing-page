
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const GeneralInformationSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Entity Name</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entity1">Entity 1</SelectItem>
              <SelectItem value="entity2">Entity 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hedge ID</label>
          <Input type="text" placeholder="Enter hedge ID" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Risk Type</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select risk type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fx">Foreign Exchange</SelectItem>
              <SelectItem value="ir">Interest Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Entity Currency</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Documentation Date</label>
          <Input type="date" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hedge Type</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select hedge type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashflow">Cashflow</SelectItem>
              <SelectItem value="fair-value">Fair Value</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Exposed Currency</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformationSection;
