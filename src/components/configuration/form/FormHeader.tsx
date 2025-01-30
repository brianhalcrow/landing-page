import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import EntitySelectionFields from "./EntitySelectionFields";
import DeleteEntityButton from "./DeleteEntityButton";

interface FormHeaderProps {
  form: UseFormReturn<FormValues>;
  entities: any[] | undefined;
  isLoadingEntities: boolean;
  onFetchConfig: (entityId: string) => Promise<void>;
  onUploadComplete: () => void;
}

const FormHeader = ({
  form,
  entities,
  isLoadingEntities,
  onFetchConfig,
  onUploadComplete,
}: FormHeaderProps) => {
  const selectedEntityId = form.watch("entity_id");
  const selectedEntity = entities?.find(e => e.entity_id === selectedEntityId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <EntitySelectionFields
          form={form}
          entities={entities}
          isLoadingEntities={isLoadingEntities}
          onFetchConfig={onFetchConfig}
        />
        {selectedEntityId && selectedEntity && (
          <DeleteEntityButton
            entityId={selectedEntityId}
            entityName={selectedEntity.entity_name}
            onDelete={() => {
              form.reset();
              onUploadComplete();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FormHeader;