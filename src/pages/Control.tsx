
import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";

const Control = () => {
  return (
    <div className="container-fluid px-6 py-6">
      <TabsContainer 
        tabs={tabsConfig["control"]} 
      />
    </div>
  );
};

export default Control;
