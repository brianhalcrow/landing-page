
import CounterpartiesGrid from "./CounterpartiesGrid";
import { InstrumentsConfigGrid } from "./components/InstrumentsConfigGrid";
import { Separator } from "@/components/ui/separator";

const CounterpartiesTab = () => {
  return (
    <div className="p-6 space-y-8">
      <CounterpartiesGrid />
      <Separator className="my-8" />
      <InstrumentsConfigGrid />
    </div>
  );
};

export default CounterpartiesTab;
