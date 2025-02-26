
import { useState } from 'react';
import { HeaderControls } from './HeaderControls';

interface LayerControlsProps {
  hedgeLayer: string;
  hedgeRatio: string;
  selectedDate: Date | undefined;
  onLayerChange: (value: number) => void;
  onHedgeLayerChange: (value: string) => void;
  onHedgeRatioChange: (value: string) => void;
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
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
      selectedDate={selectedDate}
      hedgeLayer={hedgeLayer}
      hedgeRatio={hedgeRatio}
      selectedLayerNumber={selectedLayer}
      onLayerChange={handleLayerChange}
      onHedgeLayerChange={onHedgeLayerChange}
      onHedgeRatioChange={onHedgeRatioChange}
      onDateChange={onDateChange}
    />
  );
};
