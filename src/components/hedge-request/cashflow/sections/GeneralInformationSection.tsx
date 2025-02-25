
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
  const { entities, hedgingEntities } = useEntityData();

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
        value={generalInfo.documentation_date}
        onChange={(value) => onChange({ ...generalInfo, documentation_date: value })}
      />

      <CurrencySelector
        value={generalInfo.transaction_currency}
        onChange={(value) => onChange({ ...generalInfo, transaction_currency: value })}
      />

      <ExposureCategories
        exposureCategoryL1={generalInfo.exposure_category_l1}
        exposureCategoryL2={generalInfo.exposure_category_l2}
        exposureCategoryL3={generalInfo.exposure_category_l3}
        strategy={generalInfo.strategy}
        onExposureCategoryL1Change={(value) => onChange({ ...generalInfo, exposure_category_l1: value })}
        onExposureCategoryL2Change={(value) => {
          onChange({ ...generalInfo, exposure_category_l2: value });
          onExposureCategoryL2Change(value);
        }}
        onExposureCategoryL3Change={(value) => onChange({ ...generalInfo, exposure_category_l3: value })}
        onStrategyChange={onStrategyChange}
      />

      <HedgingEntityFields
        entities={hedgingEntities || []}
        selectedHedgingEntity={generalInfo.hedging_entity}
        onHedgingEntityChange={handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={generalInfo.hedging_entity_fccy}
      />
    </div>
  );
};

export default GeneralInformationSection;
