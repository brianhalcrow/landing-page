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
      <TabsList className="w-full justify-start overflow-x-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsContainer;