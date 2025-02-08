
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import { useSearchParams } from "react-router-dom";

const DataSources = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "connections";

  return (
    <div className="h-full">
      <TabsContainer 
        tabs={tabsConfig["data-sources"]} 
        defaultTab={defaultTab} 
      />
    </div>
  );
};

export default DataSources;
