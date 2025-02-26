
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { DocumentationDateInput } from '../components/DocumentationDateInput';
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
    const exposureConfig = useExposureConfig('');
    const calculations = useExposureCalculations(hedgeId || '');

    useImperativeHandle(ref, () => ({
      getCurrentLayerData: () => {
        console.log('Getting current layer data...');
        const data = calculations.getCurrentLayerData();
        if (data && hedgeId) {
          const layerDetails: HedgeLayerDetails = {
            ...data,
            hedge_id: hedgeId,
            layer_number: 1, // You might want to make this dynamic based on your needs
          };
          // Attempt to save the layer details immediately
          saveHedgeLayerDetails(layerDetails).then(success => {
            if (success) {
              console.log('Successfully saved layer details');
            } else {
              console.error('Failed to save layer details');
            }
          });
          return layerDetails;
        }
        return null;
      }
    }));

    useEffect(() => {
      if (documentationDate) {
        calculations.setSelectedDate(new Date(documentationDate));
      }
    }, [documentationDate, calculations]);

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

ExposureDetailsSection.displayName = 'ExposureDetailsSection';

export default ExposureDetailsSection;
