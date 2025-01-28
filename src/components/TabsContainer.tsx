import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
}

const TabsContainer = ({ tabs, defaultTab }: TabsContainerProps) => {
  if (!tabs || tabs.length === 0) {
    return <div>No tabs configured</div>;
  }

  return (
    <Tabs defaultValue={defaultTab || tabs[0].value} className="w-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="p-6">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default TabsContainer;