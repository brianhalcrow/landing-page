import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import ExistingEntityFields from "./ExistingEntityFields";
import FunctionalCurrencyField from "./FunctionalCurrencyField";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const validateEntityDetails = async (entityId: string, entityName: string, functionalCurrency?: string) => {
    try {
      const { data: entityConfig, error } = await supabase
        .from('config_entity')
        .select('*')
        .eq('entity_id', entityId)
        .single();

      if (error) {
        toast.error("Failed to validate entity details");
        return false;
      }

      if (entityConfig.entity_name !== entityName) {
        toast.error("Entity name does not match configuration");
        return false;
      }

      if (functionalCurrency && entityConfig.functional_currency !== functionalCurrency) {
        toast.error("Functional currency does not match configuration");
        return false;
      }

      return true;
    } catch (error) {
      toast.error("Error validating entity details");
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <ExistingEntityFields 
          form={form}
          entities={entities}
          isLoadingEntities={isLoadingEntities}
          onFetchConfig={onFetchConfig}
        />
        <FunctionalCurrencyField 
          form={form} 
          onValidate={validateEntityDetails}
        />
      </div>
    </div>
  );
};

export default EntitySelectionFields;