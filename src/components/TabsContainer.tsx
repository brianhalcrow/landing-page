
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
  const [currentTab, setCurrentTab] = useState(defaultTab || tabs[0]?.value);

  if (!tabs || tabs.length === 0) {
    return <div>No tabs configured</div>;
  }

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <div className="sticky top-0 z-10 bg-background">
        <TabsList className="justify-start overflow-x-auto bg-background">
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
