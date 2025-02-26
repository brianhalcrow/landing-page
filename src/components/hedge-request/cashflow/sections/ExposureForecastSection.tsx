
import { forwardRef } from 'react';
import { DocumentationDateInput } from '../components/DocumentationDateInput';
import { ExposureGrid } from '../components/ExposureGrid';
import { useExposureConfig } from '../hooks/useExposureConfig';
import { useExposureCalculations } from '../hooks/useExposureCalculations';

interface ExposureForecastValue {
  start_month: string | null;
  end_month: string | null;
}

interface ExposureForecastSectionProps {
  value: ExposureForecastValue;
  onChange: (value: ExposureForecastValue) => void;
  documentationDate?: string;
  hedgeId?: string;
}

export const ExposureForecastSection = forwardRef<{}, ExposureForecastSectionProps>(
  ({ value, onChange, documentationDate, hedgeId }, ref) => {
    const exposureConfig = useExposureConfig('');
    const calculations = useExposureCalculations(hedgeId || '');

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
            <DocumentationDateInput
              documentDate={value.start_month || ''}
              onDateChange={(newDate) => handleStartMonthChange(newDate ? new Date(newDate) : null)}
            />
          </div>
          <div>
            <DocumentationDateInput
              documentDate={value.end_month || ''}
              onDateChange={(newDate) => handleEndMonthChange(newDate ? new Date(newDate) : null)}
            />
          </div>
        </div>

        {value.start_month && value.end_month && exposureConfig.data && (
          <ExposureGrid
            months={Object.keys(calculations.revenues)}
            revenues={calculations.revenues}
            costs={calculations.costs}
            forecasts={calculations.forecasts}
            hedgedExposures={calculations.hedgedExposures}
            hedgeAmounts={calculations.hedgeAmounts}
            indicativeCoverage={calculations.indicativeCoverage}
            cumulativeAmounts={calculations.cumulativeAmounts}
            cumulativeCoverage={calculations.cumulativeCoverage}
            onRevenueChange={calculations.setRevenues}
            onCostChange={calculations.setCosts}
            onKeyDown={(event, rowIndex, colIndex) => {
              // Handle key down events
            }}
            inputRefs={[]}
          />
        )}
      </div>
    );
  }
);

ExposureForecastSection.displayName = 'ExposureForecastSection';

export default ExposureForecastSection;
