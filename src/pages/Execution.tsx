import TabsContainer from "@/components/TabsContainer";
import { tabsConfig } from "@/config/tabsConfig";
import CurrencyConverter from "@/trade/components/CurrencyConverter.jsx";

const Execution = () => {
  const amplifyUsername = "test";
  const kycComplete = true;

  return (
    <div>
      <TabsContainer tabs={tabsConfig["execution"]} />
      <CurrencyConverter amplifyUsername={amplifyUsername} kycComplete={kycComplete} />
    </div>
  );
};

export default Execution;
