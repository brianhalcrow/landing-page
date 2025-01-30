import { TabItem } from "@/components/TabsContainer";
import TabsContainer from "@/components/TabsContainer";

const DataSources = () => {
  const tabs: TabItem[] = [
    {
      value: "data-sources",
      label: "Data Sources",
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Sources</h2>
          <p className="text-gray-600">
            Configure and manage your data source connections.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full">
      <TabsContainer tabs={tabs} defaultTab="data-sources" />
    </div>
  );
};

export default DataSources;