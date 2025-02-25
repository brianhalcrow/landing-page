
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const HedgingInstrumentSection = () => {
  const [type, setType] = useState("");
  const [forwardElement, setForwardElement] = useState("");
  const [currencyBasis, setCurrencyBasis] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Instrument Type</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="forward">Forward Contract</SelectItem>
              <SelectItem value="option">Option</SelectItem>
              <SelectItem value="swap">Swap</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Forward Element Designation</label>
          <Select value={forwardElement} onValueChange={setForwardElement}>
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="included">Included</SelectItem>
              <SelectItem value="excluded">Excluded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Foreign Currency Basis Spreads</label>
          <Select value={currencyBasis} onValueChange={setCurrencyBasis}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="included">Included</SelectItem>
              <SelectItem value="excluded">Excluded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          placeholder="Enter hedging instrument description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default HedgingInstrumentSection;
