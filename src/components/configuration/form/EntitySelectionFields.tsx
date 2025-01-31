import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import ExistingEntityFields from "./ExistingEntityFields";
import FunctionalCurrencyField from "./FunctionalCurrencyField";
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
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <ExistingEntityFields 
          form={form}
          entities={entities}
          isLoadingEntities={isLoadingEntities}
          onFetchConfig={onFetchConfig}
        />
        <FunctionalCurrencyField form={form} />
      </div>
    </div>
  );
};

export default EntitySelectionFields;