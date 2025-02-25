
import React from 'react';
import { EntityInformation } from '../components/EntityInformation';
import { useEntityData } from '../hooks/useEntityData';
import { ExposureCategories } from '../components/ExposureCategories';
import { DocumentationDateInput } from '../components/DocumentationDateInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { HedgingEntityFields } from '../components/HedgingEntityFields';
import { GeneralInformationData } from '../types/general-information';

interface GeneralInformationSectionProps {
  generalInfo: GeneralInformationData;
  onChange: (value: GeneralInformationData) => void;
  onExposureCategoryL2Change: (value: string) => void;
  onStrategyChange: (value: string, instrument: string) => void;
  hedgeId: string;
}

const GeneralInformationSection: React.FC<GeneralInformationSectionProps> = ({
  generalInfo,
  onChange,
  onExposureCategoryL2Change,
  onStrategyChange,
  hedgeId
}) => {
  // Pass the entity ID to useEntityData
  const { entities, entityCounterparty } = useEntityData(generalInfo.entity_id);

  // Since hedgingEntities is not returned from useEntityData, we'll use entities for now
  const hedgingEntities = entities;

  const handleEntityChange = (entityId: string, entityName: string) => {
    onChange({
      ...generalInfo,
      entity_id: entityId,
      entity_name: entityName,
      functional_currency: entities?.find(e => e.entity_id === entityId)?.functional_currency || ''
    });
  };

  const handleCostCentreChange = (value: string) => {
    onChange({
      ...generalInfo,
      cost_centre: value
    });
  };

  const handleHedgingEntityChange = (entityName: string) => {
    const selectedEntity = hedgingEntities?.find(e => e.entity_name === entityName);
    onChange({
      ...generalInfo,
      hedging_entity: entityName,
      hedging_entity_fccy: selectedEntity?.functional_currency || ''
    });
  };

  return (
    <div className="space-y-4">
      <EntityInformation
        entities={entities || []}
        selectedEntityId={generalInfo.entity_id}
        selectedEntityName={generalInfo.entity_name}
        onEntityChange={handleEntityChange}
        costCentre={generalInfo.cost_centre}
        onCostCentreChange={handleCostCentreChange}
        selectedHedgingEntity={generalInfo.hedging_entity}
        onHedgingEntityChange={handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={generalInfo.hedging_entity_fccy}
        availableHedgingEntities={hedgingEntities}
        hedgeId={hedgeId}
      />

      <DocumentationDateInput
        documentDate={generalInfo.documentation_date}
        onDateChange={(value) => onChange({ ...generalInfo, documentation_date: value })}
      />

      <CurrencySelector
        currency={generalInfo.transaction_currency}
        onCurrencyChange={(value) => onChange({ ...generalInfo, transaction_currency: value })}
      />

      <ExposureCategories
        selectedCategories={{
          l1: generalInfo.exposure_category_l1,
          l2: generalInfo.exposure_category_l2,
          l3: generalInfo.exposure_category_l3,
          strategy: generalInfo.strategy
        }}
        onCategoryChange={(level, value) => {
          switch(level) {
            case 'L1':
              onChange({ ...generalInfo, exposure_category_l1: value });
              break;
            case 'L2':
              onChange({ ...generalInfo, exposure_category_l2: value });
              onExposureCategoryL2Change(value);
              break;
            case 'L3':
              onChange({ ...generalInfo, exposure_category_l3: value });
              break;
            case 'strategy':
              onStrategyChange(value, ''); // Passing empty string as instrument for now
              break;
          }
        }}
        exposureConfigs={null}
        strategies={null}
        getCategoryOptions={{
          l1: () => [],
          l2: () => [],
          l3: () => [],
          strategies: () => []
        }}
      />

      <HedgingEntityFields
        selectedHedgingEntity={generalInfo.hedging_entity}
        onHedgingEntityChange={handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={generalInfo.hedging_entity_fccy}
        availableHedgingEntities={hedgingEntities}
      />
    </div>
  );
};

export default GeneralInformationSection;
