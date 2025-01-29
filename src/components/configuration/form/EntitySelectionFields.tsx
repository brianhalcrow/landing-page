import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import { useState } from "react";
import EntityModeToggle from "./EntityModeToggle";
import NewEntityFields from "./NewEntityFields";
import ExistingEntityFields from "./ExistingEntityFields";
import FunctionalCurrencyField from "./FunctionalCurrencyField";

interface EntitySelectionFieldsProps {
  form: UseFormReturn<FormValues>;
  entities: any[] | undefined;
  isLoadingEntities: boolean;
  onFetchConfig: (entityId: string) => Promise<void>;
}

const EntitySelectionFields = ({ 
  form, 
  entities, 
  isLoadingEntities,
  onFetchConfig 
}: EntitySelectionFieldsProps) => {
  const [isNewEntity, setIsNewEntity] = useState(false);

  const handleModeToggle = () => {
    setIsNewEntity(!isNewEntity);
    form.reset({
      entity_id: "",
      entity_name: "",
      functional_currency: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        {isNewEntity ? (
          <NewEntityFields form={form} />
        ) : (
          <ExistingEntityFields 
            form={form}
            entities={entities}
            isLoadingEntities={isLoadingEntities}
            onFetchConfig={onFetchConfig}
          />
        )}
        <FunctionalCurrencyField form={form} />
        <EntityModeToggle 
          isNewEntity={isNewEntity} 
          onToggle={handleModeToggle} 
        />
      </div>
    </div>
  );
};

export default EntitySelectionFields;