
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { DateInput } from '../components/DocumentationDateInput';
import { ExposureGrid } from '../components/ExposureGrid';
import { useExposureConfig } from '../hooks/useExposureConfig';
import { useExposureCalculations } from '../hooks/useExposureCalculations';
import { HedgeLayerDetails } from '../types/hedge-layer';
import { saveHedgeLayerDetails } from '../services/hedgeLayerService';

interface ExposureDetailsValue {
  start_month: string | null;
  end_month: string | null;
}

interface ExposureDetailsSectionProps {
  value: ExposureDetailsValue;
  onChange: (value: ExposureDetailsValue) => void;
  documentationDate?: string;
  hedgeId?: string;
}

export const ExposureDetailsSection = forwardRef<{ getCurrentLayerData: () => HedgeLayerDetails | null }, ExposureDetailsSectionProps>(
  ({ value, onChange, documentationDate, hedgeId }, ref) => {
    const exposureConfig = useExposureConfig();
    const calculations = useExposureCalculations(hedgeId);

    useImperativeHandle(ref, () => ({
      getCurrentLayerData: () => {
        console.log('Getting current layer data...');
        const data = calculations.getCurrentLayerData();
        if (data && hedgeId) {
          data.hedge_id = hedgeId;
          // Attempt to save the layer details immediately
          saveHedgeLayerDetails(data).then(success => {
            if (success) {
              console.log('Successfully saved layer details');
            } else {
              console.error('Failed to save layer details');
            }
          });
        }
        return data;
      }
    }));

    useEffect(() => {
      if (documentationDate) {
        calculations.setSelectedDate(new Date(documentationDate));
      }
    }, [documentationDate]);

    const handleStartMonthChange = (date: Date | null) => {
      onChange({
        ...value,
        start_month: date ? date.toISOString() : null
      });
      if (date) {
        calculations.setSelectedDate(date);
      }
    };

    const handleEndMonthChange = (date: Date | null) => {
      onChange({
        ...value,
        end_month: date ? date.toISOString() : null
      });
      if (date) {
        calculations.setEndDate(date);
      }
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <DateInput
              label="Start Month"
              value={value.start_month ? new Date(value.start_month) : null}
              onChange={handleStartMonthChange}
            />
          </div>
          <div>
            <DateInput
              label="End Month"
              value={value.end_month ? new Date(value.end_month) : null}
              onChange={handleEndMonthChange}
              minDate={value.start_month ? new Date(value.start_month) : undefined}
            />
          </div>
        </div>

        {value.start_month && value.end_month && (
          <ExposureGrid
            config={exposureConfig}
            startMonth={new Date(value.start_month)}
            endMonth={new Date(value.end_month)}
            calculations={calculations}
          />
        )}
      </div>
    );
  }
);

ExposureDetailsSection.displayName = 'ExposureDetailsSection';

export default ExposureDetailsSection;
