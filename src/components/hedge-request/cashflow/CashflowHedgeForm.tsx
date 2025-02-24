
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeneralInformationSection from "./sections/GeneralInformationSection";
import RiskManagementSection from "./sections/RiskManagementSection";
import HedgedItemSection from "./sections/HedgedItemSection";
import HedgingInstrumentSection from "./sections/HedgingInstrumentSection";

const CashflowHedgeForm = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Cashflow Hedge Documentation</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent>
          <GeneralInformationSection />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Management Objective and Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskManagementSection />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hedged Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <HedgedItemSection />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hedging Instrument</CardTitle>
        </CardHeader>
        <CardContent>
          <HedgingInstrumentSection />
        </CardContent>
      </Card>
    </div>
  );
};

export default CashflowHedgeForm;
