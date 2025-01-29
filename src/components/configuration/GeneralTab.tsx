import ConfigurationForm from "./form/ConfigurationForm";
import ConfigurationGrid from "./ConfigurationGrid";
import { useEntities } from "@/hooks/useEntities";

const GeneralTab = () => {
  const { entities, isLoading } = useEntities();

  return (
    <div className="p-6 space-y-8">
      <ConfigurationForm />
      <ConfigurationGrid entities={entities} />
    </div>
  );
};

export default GeneralTab;