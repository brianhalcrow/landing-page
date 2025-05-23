
import { useEffect } from "react";
import { EntityInformation } from "../components/EntityInformation";
import { ExposureCategories } from "../components/ExposureCategories";
import { CurrencySelector } from "../components/CurrencySelector";
import { DocumentationDateInput } from "../components/DocumentationDateInput";
import { HedgingEntityFields } from "../components/HedgingEntityFields";
import { useGeneralInformationForm } from "../hooks/useGeneralInformationForm";
import type { GeneralInformationData } from "../types/general-information";

interface GeneralInformationSectionProps {
  onExposureCategoryL2Change: (value: string) => void;
  onStrategyChange: (value: string, instrument: string) => void;
  onChange: (data: GeneralInformationData) => void;
  generalInfo: GeneralInformationData;
  hedgeId: string;
}

const GeneralInformationSection = ({ 
  onExposureCategoryL2Change,
  onStrategyChange,
  onChange,
  generalInfo,
  hedgeId
}: GeneralInformationSectionProps) => {
  const { state, actions } = useGeneralInformationForm(onChange, generalInfo);

  const handleCategoryChange = (level: 'L1' | 'L2' | 'L3' | 'strategy', value: string) => {
    actions.handleCategoryChange(level, value);
    if (level === 'L2') {
      onExposureCategoryL2Change(value);
    }
    if (level === 'strategy' && state.strategies) {
      const selectedStrategyData = state.strategies.find(s => s.strategy_name === value);
      if (selectedStrategyData) {
        onStrategyChange(value, selectedStrategyData.instrument);
      }
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      <EntityInformation
        entities={state.entities}
        selectedEntityId={state.selectedEntityId}
        selectedEntityName={state.selectedEntityName}
        onEntityChange={actions.handleEntityChange}
        costCentre={state.costCentre}
        onCostCentreChange={actions.setCostCentre}
        selectedHedgingEntity={state.selectedHedgingEntity}
        onHedgingEntityChange={actions.handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={state.hedgingEntityFunctionalCurrency}
        availableHedgingEntities={state.availableHedgingEntities}
        hedgeId={hedgeId}
      />

      <CurrencySelector
        exposedCurrency={state.exposedCurrency}
        onCurrencyChange={actions.setExposedCurrency}
        currencies={state.currencies}
      />

      <DocumentationDateInput
        documentDate={state.documentDate}
        onDateChange={actions.setDocumentDate}
      />

      <ExposureCategories
        exposureConfigs={state.exposureConfigs}
        strategies={state.strategies}
        selectedCategories={{
          l1: state.selectedExposureCategoryL1,
          l2: state.selectedExposureCategoryL2,
          l3: state.selectedExposureCategoryL3,
          strategy: state.selectedStrategy
        }}
        onCategoryChange={handleCategoryChange}
        getCategoryOptions={actions.getCategoryOptions}
      />

      <HedgingEntityFields
        selectedHedgingEntity={state.selectedHedgingEntity}
        onHedgingEntityChange={actions.handleHedgingEntityChange}
        hedgingEntityFunctionalCurrency={state.hedgingEntityFunctionalCurrency}
        availableHedgingEntities={state.availableHedgingEntities}
      />
    </div>
  );
};

export default GeneralInformationSection;
