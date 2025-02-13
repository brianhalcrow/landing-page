
import TabsContainer from "@/components/TabsContainer";
import EntityConfigurationTab from "@/components/configuration/entity/EntityConfigurationTab";

const Configuration = () => {
  const tabs = [
    {
      value: "entities",
      label: "Entities",
      content: <EntityConfigurationTab />,
    },
  ];

  return (
    <div className="flex-1 space-y-4">
      <TabsContainer tabs={tabs} defaultTab="entities" />
    </div>
  );
};

export default Configuration;
