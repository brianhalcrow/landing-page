
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormStateProvider } from "./form-sections/FormStateProvider";
import { FormContent } from "./form-sections/FormContent";

export const IFRS9HedgeForm = () => {
  const [currentTab, setCurrentTab] = useState("cashflow");

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <FormStateProvider>
      <form className="flex flex-col h-full">
        <div className="fixed top-[104px] left-[240px] right-0 bg-gray-100 z-30 border-b">
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full justify-start ml-0 bg-gray-100">
              <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
              <TabsTrigger value="intramonth">Intramonth</TabsTrigger>
              <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
              <TabsTrigger value="ad-hoc">Ad-Hoc</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 mt-[140px]">
          {currentTab === "cashflow" && <FormContent />}
          {currentTab === "intramonth" && (
            <div className="p-8">Intramonth content coming soon</div>
          )}
          {currentTab === "balance-sheet" && (
            <div className="p-8">Balance Sheet functionality coming soon...</div>
          )}
          {currentTab === "ad-hoc" && (
            <div className="p-8">Ad-Hoc content coming soon</div>
          )}
        </div>
      </form>
    </FormStateProvider>
  );
};

export default IFRS9HedgeForm;
