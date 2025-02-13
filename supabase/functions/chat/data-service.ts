import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ExtractedCurrency, ExtractedEntity } from './openai-service.ts'

export interface RateInfo {
  rate_date: string;
  closing_rate?: number;
  all_in_rate?: number;
}

export interface ExposureType {
  exposure_type_id: number;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  subsystem: string;
  is_active: boolean;
}

export async function getRateInfo(
  supabase: ReturnType<typeof createClient>,
  currencyInfo: ExtractedCurrency
) {
  const { data: ratesData, error: ratesError } = await supabase
    .from('rates')
    .select('*')
    .eq('base_currency', currencyInfo.base_currency)
    .eq('quote_currency', currencyInfo.quote_currency)
    .order('rate_date', { ascending: false })
    .limit(1);

  if (ratesError || !ratesData?.length) {
    return null;
  }

  return ratesData[0];
}

export async function getForwardRateInfo(
  supabase: ReturnType<typeof createClient>,
  currencyInfo: ExtractedCurrency
) {
  const { data: forwardRatesData, error: forwardRatesError } = await supabase
    .from('rates_forward')
    .select('*')
    .eq('currency_pair', `${currencyInfo.base_currency}${currencyInfo.quote_currency}`)
    .order('rate_date', { ascending: false })
    .limit(1);

  if (forwardRatesError || !forwardRatesData?.length) {
    return null;
  }

  return forwardRatesData[0];
}

export async function getEntityInfo(
  supabase: ReturnType<typeof createClient>,
  entityInfo: ExtractedEntity
) {
  const { data: entityData, error: entityError } = await supabase
    .from('entities')
    .select('*')
    .eq('entity_name', entityInfo.entity_name)
    .single();

  if (entityError || !entityData) {
    return null;
  }

  return entityData;
}

export async function getEntityExposureTypes(
  supabase: ReturnType<typeof createClient>,
  entityId: string
): Promise<ExposureType[]> {
  const { data, error } = await supabase
    .from('exposure_types')
    .select(`
      exposure_type_id,
      exposure_category_l1,
      exposure_category_l2,
      exposure_category_l3,
      subsystem,
      is_active
    `)
    .eq('is_active', true)
    .order('exposure_category_l1');

  if (error) {
    console.error('Error fetching exposure types:', error);
    return [];
  }

  // Get entity-specific exposure configurations
  const { data: entityConfig, error: entityError } = await supabase
    .from('entity_exposure_config')
    .select('exposure_type_id')
    .eq('entity_id', entityId)
    .eq('is_active', true);

  if (entityError) {
    console.error('Error fetching entity exposure config:', entityError);
    return [];
  }

  // Filter exposure types based on entity configuration
  const activeExposureTypeIds = entityConfig?.map(config => config.exposure_type_id) || [];
  return data.filter(exposureType => activeExposureTypeIds.includes(exposureType.exposure_type_id));
}
