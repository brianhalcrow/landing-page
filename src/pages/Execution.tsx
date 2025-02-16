import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import FxTrade from "@/trade/components/FxTrade.jsx";

const Execution = () => {
  const amplifyUsername = "test";
  const kycComplete = true;

  return (
    <div>
      <TabsContainer tabs={tabsConfig["execution"]} />
      <FxTrade amplifyUsername={amplifyUsername} kycComplete={kycComplete} />
    </div>
  );
};

export default Execution;
