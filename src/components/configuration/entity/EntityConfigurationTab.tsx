
import EntityGrid from "./EntityGrid";

const EntityConfigurationTab = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Entity Configuration</h2>
        <p className="text-muted-foreground">
          Manage your organization's entities and their configurations
        </p>
      </div>
      <EntityGrid />
    </div>
  );
};

export default EntityConfigurationTab;
