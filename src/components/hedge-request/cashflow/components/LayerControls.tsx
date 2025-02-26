
import { useState } from 'react';
import { format } from 'date-fns';
import { HeaderControls } from './HeaderControls';

interface LayerControlsProps {
  hedgeLayer: string;
  hedgeRatio: string;
  selectedDate: Date | undefined;
  onLayerChange: (value: number) => void;
  onHedgeLayerChange: (value: string) => void;
  onHedgeRatioChange: (value: string) => void;
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

export const LayerControls = ({
  hedgeLayer,
  hedgeRatio,
  selectedDate,
  onLayerChange,
  onHedgeLayerChange,
  onHedgeRatioChange,
  onDateChange
}: LayerControlsProps) => {
  const [selectedLayer, setSelectedLayer] = useState<number>(1);

  const handleLayerChange = (value: number) => {
    setSelectedLayer(value);
    onLayerChange(value);
  };

  return (
    <HeaderControls
      hedgeLayer={hedgeLayer}
      hedgeRatio={hedgeRatio}
      selectedDate={selectedDate}
      selectedLayerNumber={selectedLayer}
      onLayerChange={handleLayerChange}
      onHedgeLayerChange={onHedgeLayerChange}
      onHedgeRatioChange={onHedgeRatioChange}
      onDateChange={onDateChange}
    />
  );
};
