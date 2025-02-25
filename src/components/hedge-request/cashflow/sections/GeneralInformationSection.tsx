
import { useState } from "react";
import { EntityInformation } from "../components/EntityInformation";
import { useEntityData } from "../hooks/useEntityData";
import { ExposureCategories } from "../components/ExposureCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useExposureConfig } from "../hooks/useExposureConfig";
import { useStrategies } from "../hooks/useStrategies";

const TREASURY_ENTITY_NAME = "Treasury";
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY"];

interface GeneralInfo {
  entityId: string;
  entityName: string;
  costCentre: string;
  exposedCurrency: string;
  documentDate: string;
  hedgingEntity: string;
  hedgingEntityFunctionalCurrency: string;
}

interface GeneralInformationSectionProps {
  onExposureCategoryL2Change: (value: string) => void;
  onStrategyChange: (value: string, instrument: string) => void;
  onGeneralInfoChange: (info: Partial<GeneralInfo>) => void;
  generalInfo: GeneralInfo;
}

const GeneralInformationSection = ({ 
  onExposureCategoryL2Change,
  onStrategyChange,
  onGeneralInfoChange,
  generalInfo 
}: GeneralInformationSectionProps) => {
  const [selectedExposureCategoryL1, setSelectedExposureCategoryL1] = useState("");
  const [selectedExposureCategoryL2, setSelectedExposureCategoryL2] = useState("");
  const [selectedExposureCategoryL3, setSelectedExposureCategoryL3] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");

  const { entities, entityCounterparty } = useEntityData(generalInfo.entityId);
  const { data: exposureConfigs } = useExposureConfig(generalInfo.entityId);
  const { data: strategies } = useStrategies(generalInfo.entityId, selectedExposureCategoryL2);

  const handleCategoryChange = (level: 'L1' | 'L2' | 'L3' | 'strategy', value: string) => {
    switch(level) {
      case 'L1':
        setSelectedExposureCategoryL1(value);
        break;
      case 'L2':
        setSelectedExposureCategoryL2(value);
        onExposureCategoryL2Change(value);
        break;
      case 'L3':
        setSelectedExposureCategoryL3(value);
        break;
      case 'strategy':
        setSelectedStrategy(value);
        const strategy = strategies?.find(s => s.strategy_name === value);
        if (strategy) {
          onStrategyChange(value, strategy.instrument);
        }
        break;
    }
  };

  const getCategoryOptions = {
    l1: () => [...new Set(exposureConfigs?.map(config => config.exposure_types.exposure_category_l1) || [])],
    l2: () => [...new Set(exposureConfigs?.filter(
      config => config.exposure_types.exposure_category_l1 === selectedExposureCategoryL1
    ).map(config => config.exposure_types.exposure_category_l2) || [])],
    l3: () => [...new Set(exposureConfigs?.filter(
      config => config.exposure_types.exposure_category_l2 === selectedExposureCategoryL2
    ).map(config => config.exposure_types.exposure_category_l3) || [])],
    strategies: () => strategies || []
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <div className="col-span-6">
        <EntityInformation
          entities={entities}
          selectedEntityId={generalInfo.entityId}
          selectedEntityName={generalInfo.entityName}
          onEntityChange={(entityId, entityName) => {
            onGeneralInfoChange({
              entityId,
              entityName,
            });
          }}
          selectedHedgingEntity={generalInfo.hedgingEntity}
          onHedgingEntityChange={(entityName) => {
            const entity = entities?.find(e => e.entity_name === entityName);
            onGeneralInfoChange({
              hedgingEntity: entityName,
              hedgingEntityFunctionalCurrency: entity?.functional_currency || ''
            });
          }}
          hedgingEntityFunctionalCurrency={generalInfo.hedgingEntityFunctionalCurrency}
          availableHedgingEntities={entities ? entities.filter(entity => 
            entityCounterparty?.length ? 
            [TREASURY_ENTITY_NAME, generalInfo.entityName].includes(entity.entity_name) :
            true
          ) : null}
        />
      </div>

      <div className="col-span-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Exposed Currency</label>
          <Select 
            value={generalInfo.exposedCurrency} 
            onValueChange={(value) => onGeneralInfoChange({ exposedCurrency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(currency => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="col-span-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Documentation Date</label>
          <Input 
            type="date" 
            value={generalInfo.documentDate}
            onChange={(e) => onGeneralInfoChange({ documentDate: e.target.value })}
          />
        </div>
      </div>

      <div className="col-span-6">
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
      </div>
    </div>
  );
};

export default GeneralInformationSection;
