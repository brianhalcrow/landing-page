import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useEntityData, TREASURY_ENTITY_NAME } from "./useEntityData";
import { useExposureConfig } from "./useExposureConfig";
import { useStrategies } from "./useStrategies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GeneralInformationData } from "../types/general-information";
import type { Entity } from "./useEntityData";
import type { Strategy } from "./useStrategies";

export const useGeneralInformationForm = (onChange: (data: GeneralInformationData) => void, initialData?: GeneralInformationData) => {
  const isInitialMount = useRef(true);
  const [selectedEntityId, setSelectedEntityId] = useState(initialData?.entity_id || "");
  const [selectedEntityName, setSelectedEntityName] = useState(initialData?.entity_name || "");
  const [exposedCurrency, setExposedCurrency] = useState(initialData?.transaction_currency || "");
  const [selectedHedgingEntity, setSelectedHedgingEntity] = useState(initialData?.hedging_entity || "");
  const [hedgingEntityFunctionalCurrency, setHedgingEntityFunctionalCurrency] = useState(initialData?.hedging_entity_fccy || "");
  const [selectedExposureCategoryL1, setSelectedExposureCategoryL1] = useState(initialData?.exposure_category_l1 || "");
  const [selectedExposureCategoryL2, setSelectedExposureCategoryL2] = useState(initialData?.exposure_category_l2 || "");
  const [selectedExposureCategoryL3, setSelectedExposureCategoryL3] = useState(initialData?.exposure_category_l3 || "");
  const [selectedStrategy, setSelectedStrategy] = useState(initialData?.strategy || "");
  const [documentDate, setDocumentDate] = useState(initialData?.documentation_date || "");
  const [costCentre, setCostCentre] = useState(initialData?.cost_centre || "");

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

  useEffect(() => {
    if (initialData && isInitialMount.current) {
      setSelectedEntityId(initialData.entity_id);
      setSelectedEntityName(initialData.entity_name);
      setExposedCurrency(initialData.transaction_currency);
      setSelectedHedgingEntity(initialData.hedging_entity);
      setHedgingEntityFunctionalCurrency(initialData.hedging_entity_fccy);
      setSelectedExposureCategoryL1(initialData.exposure_category_l1);
      setSelectedExposureCategoryL2(initialData.exposure_category_l2);
      setSelectedExposureCategoryL3(initialData.exposure_category_l3);
      setSelectedStrategy(initialData.strategy);
      setDocumentDate(initialData.documentation_date);
      setCostCentre(initialData.cost_centre);
    }
    isInitialMount.current = false;
  }, [initialData]);

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
        setSelectedExposureCategoryL3('');
        setSelectedStrategy('');
        break;
      case 'L3':
        setSelectedExposureCategoryL3(value);
        setSelectedStrategy('');
        break;
      case 'strategy':
        setSelectedStrategy(value);
        break;
    }
  };

  const getCategoryOptions = {
    l1: () => {
      if (!exposureConfigs) return [];
      return [...new Set(exposureConfigs.map(config => 
        config.exposure_types.exposure_category_l1
      ))];
    },
    l2: () => {
      if (!exposureConfigs) return [];
      return [...new Set(exposureConfigs
        .filter(config => 
          config.exposure_types.exposure_category_l1 === selectedExposureCategoryL1
        )
        .map(config => config.exposure_types.exposure_category_l2))];
    },
    l3: () => {
      if (!exposureConfigs) return [];
      return [...new Set(exposureConfigs
        .filter(config => 
          config.exposure_types.exposure_category_l1 === selectedExposureCategoryL1 &&
          config.exposure_types.exposure_category_l2 === selectedExposureCategoryL2
        )
        .map(config => config.exposure_types.exposure_category_l3))];
    },
    strategies: () => {
      if (!strategies) return [];
      return strategies
    }
  };

  useEffect(() => {
    if (!isInitialMount.current) {
      onChange({
        entity_id: selectedEntityId,
        entity_name: selectedEntityName,
        cost_centre: costCentre,
        transaction_currency: exposedCurrency,
        documentation_date: documentDate,
        exposure_category_l1: selectedExposureCategoryL1,
        exposure_category_l2: selectedExposureCategoryL2,
        exposure_category_l3: selectedExposureCategoryL3,
        strategy: selectedStrategy,
        hedging_entity: selectedHedgingEntity,
        hedging_entity_fccy: hedgingEntityFunctionalCurrency,
        functional_currency: entities?.find(e => e.entity_id === selectedEntityId)?.functional_currency || ""
      });
    }
  }, [
    selectedEntityId,
    selectedEntityName,
    costCentre,
    exposedCurrency,
    documentDate,
    selectedExposureCategoryL1,
    selectedExposureCategoryL2,
    selectedExposureCategoryL3,
    selectedStrategy,
    selectedHedgingEntity,
    hedgingEntityFunctionalCurrency,
    entities,
    onChange
  ]);

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
