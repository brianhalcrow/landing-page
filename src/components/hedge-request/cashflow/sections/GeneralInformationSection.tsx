
import { useState, useEffect } from "react";
import { useEntityData, TREASURY_ENTITY_NAME } from "../hooks/useEntityData";
import { useExposureConfig } from "../hooks/useExposureConfig";
import { useStrategies } from "../hooks/useStrategies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityInformation } from "../components/EntityInformation";
import { ExposureCategories } from "../components/ExposureCategories";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { GeneralInformationData } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralInformationSectionProps {
  generalInfo: GeneralInformationData;
  onChange: (data: GeneralInformationData) => void;
  onExposureCategoryL2Change: (value: string) => void;
  onStrategyChange: (value: string, instrument: string) => void;
}

const GeneralInformationSection = ({ 
  generalInfo,
  onChange,
  onExposureCategoryL2Change,
  onStrategyChange 
}: GeneralInformationSectionProps) => {
  const { entities, entityCounterparty, isRelationshipsFetched } = useEntityData(generalInfo.entity_id);
  const { data: exposureConfigs } = useExposureConfig(generalInfo.entity_id);
  const { data: strategies } = useStrategies(generalInfo.entity_id, generalInfo.exposure_category_l2);

  // Set default documentation date on component mount
  useEffect(() => {
    if (!generalInfo.documentation_date) {
      onChange({
        ...generalInfo,
        documentation_date: format(new Date(), 'yyyy-MM-dd')
      });
    }
  }, []);

  const { data: currencies } = useQuery({
    queryKey: ['available-currencies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('erp_rates_monthly')
        .select('quote_currency')
        .limit(1000);
      
      if (error) throw error;
      return [...new Set(data.map(row => row.quote_currency))].sort();
    }
  });

  const availableHedgingEntities = entities ? entities.filter(entity => 
    entityCounterparty?.length ? 
      [TREASURY_ENTITY_NAME, generalInfo.entity_name].includes(entity.entity_name) :
      true
  ) : null;

  const handleEntityChange = (entityId: string, entityName: string) => {
    const selectedEntity = entities?.find(e => e.entity_id === entityId);
    onChange({
      ...generalInfo,
      entity_id: entityId,
      entity_name: entityName,
      functional_currency: selectedEntity?.functional_currency || '',
    });
  };

  const handleHedgingEntityChange = (entityName: string) => {
    const entity = entities?.find(e => e.entity_name === entityName);
    if (entity) {
      onChange({
        ...generalInfo,
        hedging_entity: entityName,
        hedging_entity_fccy: entity.functional_currency,
      });
    }
  };

  const handleExposedCurrencyChange = (value: string) => {
    onChange({
      ...generalInfo,
      transaction_currency: value,
    });
  };

  const handleCategoryChange = (level: 'L1' | 'L2' | 'L3' | 'strategy', value: string) => {
    let updates: Partial<GeneralInformationData> = {};

    switch (level) {
      case 'L1':
        updates = {
          exposure_category_l1: value,
          exposure_category_l2: '',
          exposure_category_l3: '',
          strategy: '',
        };
        break;
      case 'L2':
        updates = {
          exposure_category_l2: value,
          exposure_category_l3: '',
          strategy: '',
        };
        onExposureCategoryL2Change(value);
        break;
      case 'L3':
        updates = {
          exposure_category_l3: value,
          strategy: '',
        };
        break;
      case 'strategy':
        updates = { strategy: value };
        const selectedStrategyData = strategies?.find(s => s.strategy_name === value);
        if (selectedStrategyData) {
          onStrategyChange(value, selectedStrategyData.instrument);
        }
        break;
    }

    onChange({
      ...generalInfo,
      ...updates
    });
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <EntityInformation
        entities={entities}
        selectedEntityId={generalInfo.entity_id}
        selectedEntityName={generalInfo.entity_name}
        onEntityChange={handleEntityChange}
        selectedHedgingEntity={generalInfo.hedging_entity}
        onHedgingEntityChange={handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={generalInfo.hedging_entity_fccy}
        availableHedgingEntities={availableHedgingEntities}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Exposed Currency</label>
        <Select 
          value={generalInfo.transaction_currency} 
          onValueChange={handleExposedCurrencyChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies?.map(currency => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Documentation Date</label>
        <Input 
          type="date" 
          value={generalInfo.documentation_date}
          onChange={(e) => onChange({
            ...generalInfo,
            documentation_date: e.target.value
          })}
        />
      </div>

      <ExposureCategories
        exposureConfigs={exposureConfigs}
        strategies={strategies}
        selectedCategories={{
          l1: generalInfo.exposure_category_l1,
          l2: generalInfo.exposure_category_l2,
          l3: generalInfo.exposure_category_l3,
          strategy: generalInfo.strategy
        }}
        onCategoryChange={handleCategoryChange}
        getCategoryOptions={{
          l1: () => {
            if (!exposureConfigs) return [];
            return [...new Set(exposureConfigs
              .filter(config => 
                config.exposure_types.exposure_category_l1.toLowerCase() !== 'balance sheet'
              )
              .map(config => config.exposure_types.exposure_category_l1)
            )];
          },
          l2: () => {
            if (!exposureConfigs) return [];
            return [...new Set(exposureConfigs
              .filter(config => 
                config.exposure_types.exposure_category_l1.toLowerCase() !== 'balance sheet' &&
                (!generalInfo.exposure_category_l1 || config.exposure_types.exposure_category_l1 === generalInfo.exposure_category_l1)
              )
              .map(config => config.exposure_types.exposure_category_l2)
            )];
          },
          l3: () => {
            if (!exposureConfigs) return [];
            return [...new Set(exposureConfigs
              .filter(config => 
                config.exposure_types.exposure_category_l1.toLowerCase() !== 'balance sheet' &&
                (!generalInfo.exposure_category_l1 || config.exposure_types.exposure_category_l1 === generalInfo.exposure_category_l1) &&
                (!generalInfo.exposure_category_l2 || config.exposure_types.exposure_category_l2 === generalInfo.exposure_category_l2)
              )
              .map(config => config.exposure_types.exposure_category_l3)
            )];
          },
          strategies: () => strategies || []
        }}
      />
    </div>
  );
};

export default GeneralInformationSection;
