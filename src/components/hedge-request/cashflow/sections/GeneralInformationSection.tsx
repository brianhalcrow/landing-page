
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
    <div className="grid grid-cols-5 gap-4">
      {/* Row 1 */}
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
        <label className="text-sm font-medium">Entity ID</label>
        <Input type="text" placeholder="Enter entity ID" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Functional Currency</label>
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Documentation Date</label>
        <Input type="date" />
      </div>

      {/* Row 2 */}
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
        <label className="text-sm font-medium">Hedging Entity</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select hedging entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entity1">Entity 1</SelectItem>
            <SelectItem value="entity2">Entity 2</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity Functional Currency</label>
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
  );
};

export default GeneralInformationSection;
