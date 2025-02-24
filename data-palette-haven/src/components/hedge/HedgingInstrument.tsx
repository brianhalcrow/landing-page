import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HedgeTypeSelect } from "./hedging-instrument/HedgeTypeSelect";
import { ExposedCurrencyInput } from "./hedging-instrument/ExposedCurrencyInput";
import { ForwardElementSelect } from "./hedging-instrument/ForwardElementSelect";
import { BasisSpreadsSelect } from "./hedging-instrument/BasisSpreadsSelect";
import { InstrumentDescription } from "./hedging-instrument/InstrumentDescription";

interface HedgingInstrumentProps {
  formData: {
    instrumentType: string;
    exposedCurrency: string;
    instrumentDescription: string;
    forwardElement: string;
    basisSpreads: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export const HedgingInstrument = ({ formData, handleInputChange }: HedgingInstrumentProps) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm mt-2">
      <h2 className="text-xl font-semibold">Hedging Instrument</h2>
      <div className="grid grid-cols-9 gap-4">
        <div className="col-span-2">
          <HedgeTypeSelect
            value={formData.instrumentType}
            onChange={(value) => handleInputChange('instrumentType', value)}
          />
        </div>
        <div className="col-span-2">
          <ExposedCurrencyInput
            value={formData.exposedCurrency}
            onChange={(value) => handleInputChange('exposedCurrency', value)}
          />
        </div>
        <div className="col-span-2">
          <ForwardElementSelect
            value={formData.forwardElement}
            onChange={(value) => handleInputChange('forwardElement', value)}
          />
        </div>
        <div className="col-span-3">
          <BasisSpreadsSelect
            value={formData.basisSpreads}
            onChange={(value) => handleInputChange('basisSpreads', value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <InstrumentDescription
          value={formData.instrumentDescription}
          onChange={(value) => handleInputChange('instrumentDescription', value)}
        />
      </div>
    </div>
  );
};