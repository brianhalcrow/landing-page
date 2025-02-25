
import { EntityInformation } from "../components/EntityInformation";
import { useEntityData } from "../hooks/useEntityData";
import { ExposureCategories } from "../components/ExposureCategories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

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
  const { entities, entityCounterparty, isRelationshipsFetched } = useEntityData(generalInfo.entityId);
  const { data: exposureConfigs } = useExposureConfig(generalInfo.entityId);
  const { data: strategies } = useStrategies(generalInfo.entityId, selectedExposureCategoryL2);

  return (
    <>
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
          value={generalInfo.documentDate}
          onChange={(e) => onGeneralInfoChange({ documentDate: e.target.value })}
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
    </>
  );
};

export default GeneralInformationSection;
