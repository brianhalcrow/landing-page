import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";
import EntitySelectionFields from "./EntitySelectionFields";
import DeleteEntityButton from "./DeleteEntityButton";
import CsvOperations from "../csv/CsvOperations";

interface FormHeaderProps {
  form: UseFormReturn<FormValues>;
  entities: any[] | undefined;
  isLoadingEntities: boolean;
  onFetchConfig: (entityId: string) => Promise<void>;
  onUploadComplete: (updatedEntityIds: string[]) => void;
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
        <div className="space-y-4 flex-1">
          <EntitySelectionFields
            form={form}
            entities={entities}
            isLoadingEntities={isLoadingEntities}
            onFetchConfig={onFetchConfig}
          />
          <CsvOperations onUploadComplete={onUploadComplete} />
        </div>
        {selectedEntityId && selectedEntity && (
          <DeleteEntityButton
            entityId={selectedEntityId}
            entityName={selectedEntity.entity_name}
            onDelete={() => {
              form.reset();
              onUploadComplete([]);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FormHeader;