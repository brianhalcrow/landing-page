
import { useState, useCallback } from 'react';
import { saveHedgeLayerDetails, getHedgeLayerDetails } from '../services/hedgeLayerService';
import type { HedgeLayerDetails } from '../types/hedge-layer';

export const useHedgeLayer = (hedgeId: string) => {
  const [layers, setLayers] = useState<HedgeLayerDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLayers = useCallback(async () => {
    console.log('Loading hedge layers for hedge ID:', hedgeId);
    setLoading(true);
    try {
      const layerDetails = await getHedgeLayerDetails(hedgeId);
      console.log(`Loaded ${layerDetails.length} hedge layers`);
      setLayers(layerDetails);
    } catch (error) {
      console.error('Error in loadLayers:', error);
    } finally {
      setLoading(false);
    }
  }, [hedgeId]);

  const saveLayer = useCallback(async (layer: HedgeLayerDetails) => {
    console.log('Saving hedge layer:', {
      hedgeId: layer.hedge_id,
      layerNumber: layer.layer_number,
      monthCount: layer.monthly_data.length
    });
    
    setLoading(true);
    try {
      const success = await saveHedgeLayerDetails(layer);
      if (success) {
        console.log('Successfully saved hedge layer, reloading data');
        await loadLayers();
        return true;
      }
      console.log('Failed to save hedge layer');
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
