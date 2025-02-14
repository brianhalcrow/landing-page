
import TabsContainer from "@/components/TabsContainer";
import EntityConfigurationTab from "@/components/configuration/entity/EntityConfigurationTab";
import CounterpartiesTab from "@/components/configuration/counterparty/CounterpartiesTab";

const Configuration = () => {
  const tabs = [
    {
      value: "entities",
      label: "Entities",
      content: <EntityConfigurationTab />,
    },
    {
      value: "counterparties",
      label: "Counterparties",
      content: <CounterpartiesTab />,
    },
  ];

  return (
    <div className="flex-1 space-y-4">
      <TabsContainer tabs={tabs} defaultTab="entities" />
    </div>
  );
};

export default Configuration;
