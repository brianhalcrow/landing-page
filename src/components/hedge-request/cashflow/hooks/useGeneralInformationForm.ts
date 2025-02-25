
import { useState } from "react";
import { format } from "date-fns";
import { useEntityData, TREASURY_ENTITY_NAME } from "./useEntityData";
import { useExposureConfig } from "./useExposureConfig";
import { useStrategies } from "./useStrategies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GeneralInformationData } from "../types/general-information";
import type { Entity } from "./useEntityData";

export const useGeneralInformationForm = (onChange: (data: GeneralInformationData) => void) => {
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedEntityName, setSelectedEntityName] = useState("");
  const [exposedCurrency, setExposedCurrency] = useState("");
  const [selectedHedgingEntity, setSelectedHedgingEntity] = useState("");
  const [hedgingEntityFunctionalCurrency, setHedgingEntityFunctionalCurrency] = useState("");
  const [selectedExposureCategoryL1, setSelectedExposureCategoryL1] = useState("");
  const [selectedExposureCategoryL2, setSelectedExposureCategoryL2] = useState("");
  const [selectedExposureCategoryL3, setSelectedExposureCategoryL3] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [documentDate, setDocumentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [costCentre, setCostCentre] = useState("");

  const { entities, entityCounterparty, isRelationshipsFetched } = useEntityData(selectedEntityId);
  const { data: exposureConfigs } = useExposureConfig(selectedEntityId);
  const { data: strategies } = useStrategies(selectedEntityId, selectedExposureCategoryL2);

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

  const availableHedgingEntities = entities ? entities.filter(entity => {
    if (entityCounterparty && entityCounterparty.length > 0) {
      return entity.entity_name === TREASURY_ENTITY_NAME || entity.entity_name === selectedEntityName;
    }
    return entity.entity_name === selectedEntityName;
  }) : null;

  const resetFields = () => {
    setExposedCurrency("");
    setSelectedHedgingEntity("");
    setHedgingEntityFunctionalCurrency("");
    setSelectedExposureCategoryL1("");
    setSelectedExposureCategoryL2("");
    setSelectedExposureCategoryL3("");
    setSelectedStrategy("");
    setDocumentDate(format(new Date(), 'yyyy-MM-dd'));
    setCostCentre("");
  };

  const handleEntityChange = (entityId: string, entityName: string) => {
    if (entityId !== selectedEntityId) {
      setSelectedEntityId(entityId);
      setSelectedEntityName(entityName);
      resetFields();
      
      setSelectedHedgingEntity("");
      setHedgingEntityFunctionalCurrency("");
    }
  };

  const handleHedgingEntityChange = (entityName: string) => {
    setSelectedHedgingEntity(entityName);
    const entity = entities?.find(e => e.entity_name === entityName);
    if (entity) {
      setHedgingEntityFunctionalCurrency(entity.functional_currency);
    }
  };

  const getCategoryOptions = {
    l1: () => {
      if (!exposureConfigs) return [];
      return [...new Set(exposureConfigs
        .filter(config => 
          config.exposure_types.exposure_category_l1.toLowerCase() !== 'balance sheet' &&
          (!selectedExposureCategoryL2 || config.exposure_types.exposure_category_l2 === selectedExposureCategoryL2) &&
          (!selectedExposureCategoryL3 || config.exposure_types.exposure_category_l3 === selectedExposureCategoryL3)
        )
        .map(config => config.exposure_types.exposure_category_l1)
      )];
    },
    l2: () => {
      if (!exposureConfigs) return [];
      return [...new Set(exposureConfigs
        .filter(config => 
          config.exposure_types.exposure_category_l1.toLowerCase() !== 'balance sheet' &&
          (!selectedExposureCategoryL1 || config.exposure_types.exposure_category_l1 === selectedExposureCategoryL1) &&
          (!selectedExposureCategoryL3 || config.exposure_types.exposure_category_l3 === selectedExposureCategoryL3)
        )
        .map(config => config.exposure_types.exposure_category_l2)
      )];
    },
    l3: () => {
      if (!exposureConfigs) return [];
      return [...new Set(exposureConfigs
        .filter(config => 
          config.exposure_types.exposure_category_l1.toLowerCase() !== 'balance sheet' &&
          (!selectedExposureCategoryL1 || config.exposure_types.exposure_category_l1 === selectedExposureCategoryL1) &&
          (!selectedExposureCategoryL2 || config.exposure_types.exposure_category_l2 === selectedExposureCategoryL2)
        )
        .map(config => config.exposure_types.exposure_category_l3)
      )];
    },
    strategies: () => {
      if (!strategies) return [];
      return strategies;
    }
  };

  const handleCategoryChange = (level: 'L1' | 'L2' | 'L3' | 'strategy', value: string) => {
    switch (level) {
      case 'L1':
        setSelectedExposureCategoryL1(value);
        setSelectedExposureCategoryL2('');
        setSelectedExposureCategoryL3('');
        setSelectedStrategy('');
        break;
      case 'L2':
        setSelectedExposureCategoryL2(value);
        const possibleL1 = [...new Set(exposureConfigs
          ?.filter(c => c.exposure_types.exposure_category_l2 === value)
          .map(c => c.exposure_types.exposure_category_l1)
        )];
        if (possibleL1.length === 1 && possibleL1[0] !== selectedExposureCategoryL1) {
          setSelectedExposureCategoryL1(possibleL1[0]);
        }
        setSelectedExposureCategoryL3('');
        setSelectedStrategy('');
        break;
      case 'L3':
        setSelectedExposureCategoryL3(value);
        const config = exposureConfigs?.find(c => 
          c.exposure_types.exposure_category_l3 === value
        );
        if (config) {
          if (!selectedExposureCategoryL1) {
            setSelectedExposureCategoryL1(config.exposure_types.exposure_category_l1);
          }
          if (!selectedExposureCategoryL2) {
            setSelectedExposureCategoryL2(config.exposure_types.exposure_category_l2);
          }
        }
        setSelectedStrategy('');
        break;
      case 'strategy':
        setSelectedStrategy(value);
        break;
    }
  };

  return {
    state: {
      selectedEntityId,
      selectedEntityName,
      exposedCurrency,
      selectedHedgingEntity,
      hedgingEntityFunctionalCurrency,
      selectedExposureCategoryL1,
      selectedExposureCategoryL2,
      selectedExposureCategoryL3,
      selectedStrategy,
      documentDate,
      costCentre,
      entities,
      currencies,
      availableHedgingEntities,
      exposureConfigs,
      strategies
    },
    actions: {
      handleEntityChange,
      handleHedgingEntityChange,
      handleCategoryChange,
      setExposedCurrency,
      setDocumentDate,
      setCostCentre,
      getCategoryOptions
    }
  };
};
