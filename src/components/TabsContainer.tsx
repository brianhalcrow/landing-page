import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CsvOperationsHeader from "./configuration/CsvOperationsHeader";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: TabItem[];
  defaultTab?: string;
  showCsvOperations?: boolean;
}

const TabsContainer = ({ tabs, defaultTab, showCsvOperations }: TabsContainerProps) => {
  if (!tabs || tabs.length === 0) {
    return <div>No tabs configured</div>;
  }

  return (
    <Tabs defaultValue={defaultTab || tabs[0].value} className="w-full">
      <div className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
        <TabsList className="justify-start overflow-x-auto bg-gray-100 dark:bg-gray-800">
          {tabs.map((tab, index) => (
            <React.Fragment key={tab.value}>
              <TabsTrigger 
                value={tab.value}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                {tab.label}
              </TabsTrigger>
              {index < tabs.length - 1 && (
                <Separator orientation="vertical" className="h-6 mx-1" />
              )}
            </React.Fragment>
          ))}
        </TabsList>
      </div>
      {showCsvOperations && (
        <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <CsvOperationsHeader />
        </div>
      )}
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