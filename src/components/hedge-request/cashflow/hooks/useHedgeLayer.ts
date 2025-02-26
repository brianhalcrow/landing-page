
import { useState, useCallback } from 'react';
import { saveHedgeLayerDetails, getHedgeLayerDetails } from '../services/hedgeLayerService';
import type { HedgeLayerDetails } from '../types/hedge-layer';

export const useHedgeLayer = (hedgeId: string) => {
  const [layers, setLayers] = useState<HedgeLayerDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLayers = useCallback(async () => {
    setLoading(true);
    try {
      const layerDetails = await getHedgeLayerDetails(hedgeId);
      setLayers(layerDetails);
    } finally {
      setLoading(false);
    }
  }, [hedgeId]);

  const saveLayer = useCallback(async (layer: HedgeLayerDetails) => {
    setLoading(true);
    try {
      const success = await saveHedgeLayerDetails(layer);
      if (success) {
        await loadLayers(); // Reload the layers after successful save
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadLayers]);

  return {
    layers,
    loading,
    loadLayers,
    saveLayer
  };
};

export type UseHedgeLayerReturn = ReturnType<typeof useHedgeLayer>;
