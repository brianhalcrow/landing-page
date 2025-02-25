
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GeneralInformationSection from "./sections/GeneralInformationSection";
import RiskManagementSection from "./sections/RiskManagementSection";
import HedgedItemSection from "./sections/HedgedItemSection";
import HedgingInstrumentSection from "./sections/HedgingInstrumentSection";
import AssessmentMonitoringSection from "./sections/AssessmentMonitoringSection";
import ExposureDetailsSection from "./sections/ExposureDetailsSection";
import { Minimize2, Maximize2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CashflowHedgeForm = () => {
  const [minimizedSections, setMinimizedSections] = useState<Record<string, boolean>>({
    general: false,
    risk: false,
    hedgedItem: false,
    hedgingInstrument: false,
    assessment: false,
    exposure: false
  });

  const [selectedExposureCategoryL2, setSelectedExposureCategoryL2] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");

  const toggleSection = (section: string) => {
    setMinimizedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({
    title,
    section
  }: {
    title: string;
    section: string;
  }) => (
    <div className="flex justify-between items-center">
      <CardTitle>{title}</CardTitle>
      <button onClick={() => toggleSection(section)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        {minimizedSections[section] ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
      </button>
    </div>
  );

  // Handler for when exposure category L2 changes in GeneralInformationSection
  const handleExposureCategoryL2Change = (value: string) => {
    setSelectedExposureCategoryL2(value);
  };

  // Handler for when strategy changes in GeneralInformationSection
  const handleStrategyChange = (value: string, instrument: string) => {
    setSelectedStrategy(value);
    setSelectedInstrument(instrument);
  };

  return (
    <div className="max-w-[1525px] mx-auto px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Cashflow Hedge Documentation</h1>
      
      <Card>
        <CardHeader>
          <SectionHeader title="General Information" section="general" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.general ? "h-0 overflow-hidden p-0" : "")}>
          <GeneralInformationSection 
            onExposureCategoryL2Change={handleExposureCategoryL2Change}
            onStrategyChange={handleStrategyChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Risk Management Objective and Strategy" section="risk" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.risk ? "h-0 overflow-hidden p-0" : "")}>
          <div className="max-w-[1200px]">
            <RiskManagementSection />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Hedged Item Details" section="hedgedItem" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.hedgedItem ? "h-0 overflow-hidden p-0" : "")}>
          <div className="max-w-[1200px]">
            <HedgedItemSection />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Hedging Instrument" section="hedgingInstrument" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.hedgingInstrument ? "h-0 overflow-hidden p-0" : "")}>
          <div className="max-w-[1200px]">
            <HedgingInstrumentSection />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Assessment, Effectiveness, and Monitoring" section="assessment" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.assessment ? "h-0 overflow-hidden p-0" : "")}>
          <div className="max-w-[1200px]">
            <AssessmentMonitoringSection 
              exposureCategoryL2={selectedExposureCategoryL2}
              instrumentType={selectedInstrument}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Exposure Details" section="exposure" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.exposure ? "h-0 overflow-hidden p-0" : "")}>
          <ExposureDetailsSection />
        </CardContent>
      </Card>
    </div>
  );
};

export default CashflowHedgeForm;
