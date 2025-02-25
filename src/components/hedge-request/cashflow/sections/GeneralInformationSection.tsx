
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralInformationSectionProps {
  onExposureCategoryL2Change: (value: string) => void;
  onStrategyChange: (value: string, instrument: string) => void;
}

const GeneralInformationSection = ({ 
  onExposureCategoryL2Change,
  onStrategyChange 
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

  const availableHedgingEntities = entities ? entities.filter(entity => 
    entityCounterparty?.length ? 
      [TREASURY_ENTITY_NAME, selectedEntityName].includes(entity.entity_name) :
      true
  ) : null;

  const resetFields = () => {
    setExposedCurrency("");
    setSelectedHedgingEntity("");
    setHedgingEntityFunctionalCurrency("");
    setSelectedExposureCategoryL1("");
    setSelectedExposureCategoryL2("");
    setSelectedExposureCategoryL3("");
    setSelectedStrategy("");
    setDocumentDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleEntityChange = (entityId: string, entityName: string) => {
    if (entityId !== selectedEntityId) {
      setSelectedEntityId(entityId);
      setSelectedEntityName(entityName);
      resetFields();
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

  const handleCostCentreChange = (value: string) => {
    setCostCentre(value);
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

  return (
    <div className="grid grid-cols-6 gap-4">
      <EntityInformation
        entities={entities}
        selectedEntityId={selectedEntityId}
        selectedEntityName={selectedEntityName}
        onEntityChange={handleEntityChange}
        selectedHedgingEntity={selectedHedgingEntity}
        onHedgingEntityChange={handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={hedgingEntityFunctionalCurrency}
        availableHedgingEntities={availableHedgingEntities}
        costCentre={costCentre}
        onCostCentreChange={handleCostCentreChange}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Exposed Currency</label>
        <Select value={exposedCurrency} onValueChange={setExposedCurrency}>
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
          value={documentDate}
          onChange={(e) => setDocumentDate(e.target.value)}
        />
      </div>

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

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity</label>
        <Select value={selectedHedgingEntity} onValueChange={handleHedgingEntityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select hedging entity" />
          </SelectTrigger>
          <SelectContent>
            {availableHedgingEntities?.map(entity => (
              <SelectItem key={entity.entity_id} value={entity.entity_name}>
                {entity.entity_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hedging Entity Functional Currency</label>
        <Input 
          type="text" 
          value={hedgingEntityFunctionalCurrency} 
          disabled
          className="bg-gray-100"
        />
      </div>
    </div>
  );
};

export default GeneralInformationSection;
