
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ExposureDetailsSection = () => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2025, i + 2, 25); // Starting from March 2025
    return date.toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' });
  });

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const baseInputStyles = "text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Layer Number</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select layer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="layer1">Layer 1</SelectItem>
              <SelectItem value="layer2">Layer 2</SelectItem>
              <SelectItem value="layer3">Layer 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input type="date" defaultValue="2025-03" />
        </div>

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-medium">Hedge Ratio</label>
          <Input type="text" placeholder="Enter %" />
        </div>
      </div>

      {/* Grid Section */}
      <div>
        <div>
          {/* Month Headers */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2 mb-2">
            <div></div>
            {months.map((month) => (
              <div key={month} className="text-sm font-medium text-center">
                {month}
              </div>
            ))}
          </div>

          {/* Revenues */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2 mb-2">
            <div className="text-sm font-medium">Revenues</div>
            {Array(12).fill(null).map((_, i) => (
              <Input 
                key={i}
                type="text"
                className={baseInputStyles}
                defaultValue={i === 0 ? "5,000,000" : ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace(/,/g, ''));
                  if (!isNaN(value)) {
                    e.target.value = formatNumber(value);
                  }
                }}
              />
            ))}
          </div>

          {/* Costs */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2 mb-2">
            <div className="text-sm font-medium">Costs</div>
            {Array(12).fill(null).map((_, i) => (
              <Input 
                key={i}
                type="text"
                className={baseInputStyles}
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace(/,/g, ''));
                  if (!isNaN(value)) {
                    e.target.value = formatNumber(value);
                  }
                }}
              />
            ))}
          </div>

          {/* Forecast Exposures */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2 mb-2">
            <div className="text-sm font-medium">Forecast Exposures</div>
            {Array(12).fill(null).map((_, i) => (
              <Input 
                key={i}
                type="text"
                className={baseInputStyles}
                defaultValue={i === 0 ? "5,000,000" : "0"}
                onChange={(e) => {
                  const value = parseFloat(e.target.value.replace(/,/g, ''));
                  if (!isNaN(value)) {
                    e.target.value = formatNumber(value);
                  }
                }}
              />
            ))}
          </div>

          {/* Hedge Layer Amount */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2 mb-2">
            <div className="text-sm font-medium">Hedge Layer Amount</div>
            {Array(12).fill(null).map((_, i) => (
              <div className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
                {formatNumber(0)}
              </div>
            ))}
          </div>

          {/* Indicative Coverage */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2 mb-2">
            <div className="text-sm font-medium">Indicative Coverage</div>
            {Array(12).fill(null).map((_, i) => (
              <div className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
                0%
              </div>
            ))}
          </div>

          {/* Cum. Hedge Layer Amounts */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2 mb-2">
            <div className="text-sm font-medium">Cum. Hedge Layer Amounts</div>
            {Array(12).fill(null).map((_, i) => (
              <div className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
                {formatNumber(0)}
              </div>
            ))}
          </div>

          {/* Cum. Indicative Coverage (%) */}
          <div className="grid grid-cols-[200px_repeat(12,140px)] gap-2">
            <div className="text-sm font-medium">Cum. Indicative Coverage (%)</div>
            {Array(12).fill(null).map((_, i) => (
              <div className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
                0%
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExposureDetailsSection;
