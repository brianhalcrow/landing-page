import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

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
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center pr-6">
        <TabsList className="justify-start overflow-x-auto">
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
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
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