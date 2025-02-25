
import { useState, useEffect } from "react";
import { useEntityData, TREASURY_ENTITY_NAME } from "../hooks/useEntityData";
import { useExposureConfig } from "../hooks/useExposureConfig";
import { useStrategies } from "../hooks/useStrategies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EntityInformation } from "../components/EntityInformation";
import { ExposureCategories } from "../components/ExposureCategories";
import { CurrencySelector } from "../components/CurrencySelector";
import { DocumentationDateInput } from "../components/DocumentationDateInput";
import { HedgingEntityFields } from "../components/HedgingEntityFields";
import { format } from "date-fns";
import type { GeneralInformationData } from "../types/general-information";

interface GeneralInformationSectionProps {
  onExposureCategoryL2Change: (value: string) => void;
  onStrategyChange: (value: string, instrument: string) => void;
  onChange: (data: GeneralInformationData) => void;
  generalInfo: GeneralInformationData;
  hedgeId: string;  // Changed to required
}

const GeneralInformationSection = ({ 
  onExposureCategoryL2Change,
  onStrategyChange,
  onChange,
  generalInfo,
  hedgeId
}: GeneralInformationSectionProps) => {
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

  useEffect(() => {
    if (isRelationshipsFetched && entityCounterparty && entities) {
      if (entityCounterparty.length > 0) {
        const treasuryEntity = entities.find(e => e.entity_name === TREASURY_ENTITY_NAME);
        if (treasuryEntity) {
          setSelectedHedgingEntity(treasuryEntity.entity_name);
          setHedgingEntityFunctionalCurrency(treasuryEntity.functional_currency);
        }
      } else {
        const entity = entities.find(e => e.entity_id === selectedEntityId);
        if (entity) {
          setSelectedHedgingEntity(entity.entity_name);
          setHedgingEntityFunctionalCurrency(entity.functional_currency);
        }
      }
    }
  }, [entityCounterparty, isRelationshipsFetched, entities, selectedEntityId]);

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
        onExposureCategoryL2Change(value);
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
            onExposureCategoryL2Change(config.exposure_types.exposure_category_l2);
          }
        }
        setSelectedStrategy('');
        break;
      case 'strategy':
        setSelectedStrategy(value);
        const selectedStrategyData = strategies?.find(s => s.strategy_name === value);
        if (selectedStrategyData) {
          onStrategyChange(value, selectedStrategyData.instrument);
        }
        break;
    }
  };

  useEffect(() => {
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

  return (
    <div className="grid grid-cols-6 gap-4">
      <EntityInformation
        entities={entities}
        selectedEntityId={selectedEntityId}
        selectedEntityName={selectedEntityName}
        onEntityChange={handleEntityChange}
        costCentre={costCentre}
        onCostCentreChange={setCostCentre}
        selectedHedgingEntity={selectedHedgingEntity}
        onHedgingEntityChange={handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={hedgingEntityFunctionalCurrency}
        availableHedgingEntities={availableHedgingEntities}
        hedgeId={hedgeId}
      />

      <CurrencySelector
        exposedCurrency={exposedCurrency}
        onCurrencyChange={setExposedCurrency}
        currencies={currencies}
      />

      <DocumentationDateInput
        documentDate={documentDate}
        onDateChange={setDocumentDate}
      />

      <ExposureCategories
        exposureConfigs={exposureConfigs}
        strategies={strategies}
        selectedCategories={{
          l1: selectedExposureCategoryL1,
          l2: selectedExposureCategoryL2,
          l3: selectedExposureCategoryL3,
          strategy: selectedStrategy
        }}
        onCategoryChange={handleCategoryChange}
        getCategoryOptions={getCategoryOptions}
      />

      <HedgingEntityFields
        selectedHedgingEntity={selectedHedgingEntity}
        onHedgingEntityChange={handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={hedgingEntityFunctionalCurrency}
        availableHedgingEntities={availableHedgingEntities}
      />
    </div>
  );
};

export default GeneralInformationSection;
