import EntitySelectionFields from "./EntitySelectionFields";
import CsvOperations from "./CsvOperations";

interface FormHeaderProps {
  form: any;
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
  onUploadComplete 
}: FormHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <EntitySelectionFields 
          form={form}
          entities={entities}
          isLoadingEntities={isLoadingEntities}
          onFetchConfig={onFetchConfig}
        />
      </div>
      <CsvOperations onUploadComplete={onUploadComplete} />
    </div>
  );
};

export default FormHeader;