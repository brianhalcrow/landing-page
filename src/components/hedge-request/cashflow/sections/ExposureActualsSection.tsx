
import { forwardRef } from "react";
import { format } from "date-fns";

interface ExposureActualsSectionProps {
  documentationDate?: string;
  hedgeId?: string;
}

export const ExposureActualsSection = forwardRef<{}, ExposureActualsSectionProps>(
  ({ documentationDate, hedgeId }, ref) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2">
          <div className="h-6"></div>
          {Array(12).fill(null).map((_, index) => (
            <div key={index} className="text-sm font-medium text-center">
              {format(new Date(), 'MM-yy')}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-[200px_repeat(12,95px)] gap-2 mb-2">
          <div>
            <div className="text-sm font-medium">Actuals</div>
            <div className="text-xs text-gray-600">Long/(Short)</div>
          </div>
          {Array(12).fill(null).map((_, i) => (
            <div key={i} className="flex items-center justify-end px-3 py-2 text-sm bg-gray-50 rounded-md">
              0.00
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ExposureActualsSection.displayName = 'ExposureActualsSection';

export default ExposureActualsSection;
