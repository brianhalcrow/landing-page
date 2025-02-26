
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { HedgingInstrumentData } from "../types";

interface HedgingInstrumentSectionProps {
  selectedStrategy: string;
  instrumentType: string;
  value?: HedgingInstrumentData;
  onChange?: (value: HedgingInstrumentData) => void;
}

const HedgingInstrumentSection = ({
  selectedStrategy,
  instrumentType,
  value,
  onChange
}: HedgingInstrumentSectionProps) => {
  const [forwardElement, setForwardElement] = useState(value?.forward_element_designation || "included");
  const [currencyBasis, setCurrencyBasis] = useState(value?.currency_basis_spreads || "included");
  const [description, setDescription] = useState(value?.hedging_instrument_description || "");

  useEffect(() => {
    if (value) {
      setForwardElement(value.forward_element_designation);
      setCurrencyBasis(value.currency_basis_spreads);
      setDescription(value.hedging_instrument_description);
    }
  }, [value]);

  const handleChange = (field: keyof HedgingInstrumentData, newValue: string) => {
    const updatedValue = {
      instrument: instrumentType,
      forward_element_designation: forwardElement,
      currency_basis_spreads: currencyBasis,
      hedging_instrument_description: description,
      [field]: newValue
    };
    
    switch(field) {
      case 'forward_element_designation':
        setForwardElement(newValue);
        break;
      case 'currency_basis_spreads':
        setCurrencyBasis(newValue);
        break;
      case 'hedging_instrument_description':
        setDescription(newValue);
        break;
    }
    
    onChange?.(updatedValue);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Instrument Type</label>
          <Input 
            type="text" 
            value={instrumentType}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Forward Element Designation</label>
          <Select 
            value={forwardElement} 
            onValueChange={(value) => handleChange('forward_element_designation', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="included">Included</SelectItem>
              <SelectItem value="excluded">Excluded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Foreign Currency Basis Spreads</label>
          <Select 
            value={currencyBasis} 
            onValueChange={(value) => handleChange('currency_basis_spreads', value)}
          >
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
          onChange={(e) => handleChange('hedging_instrument_description', e.target.value)}
          rows={6}
        />
      </div>
    </div>
  );
};

export default HedgingInstrumentSection;
