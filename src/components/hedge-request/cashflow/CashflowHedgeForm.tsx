
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import GeneralInformationSection from "./sections/GeneralInformationSection";
import RiskManagementSection from "./sections/RiskManagementSection";
import HedgedItemSection from "./sections/HedgedItemSection";
import HedgingInstrumentSection from "./sections/HedgingInstrumentSection";
import AssessmentMonitoringSection from "./sections/AssessmentMonitoringSection";
import ExposureDetailsSection from "./sections/ExposureDetailsSection";
import { Minimize2, Maximize2, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface GeneralInfo {
  entityId: string;
  entityName: string;
  costCentre: string;
  exposedCurrency: string;
  documentDate: string;
  hedgingEntity: string;
  hedgingEntityFunctionalCurrency: string;
}

interface HedgeAccountingRequest {
  cost_centre: string;
  hedge_type: 'Cashflow';
  start_month: string;
  status: 'draft';
  entity_id: string;
  entity_name: string;
  hedging_entity: string;
  created_at: string;
  updated_at: string;
}

const CashflowHedgeForm = () => {
  const { toast } = useToast();
  
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
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    entityId: "",
    entityName: "",
    costCentre: "",
    exposedCurrency: "",
    documentDate: "",
    hedgingEntity: "",
    hedgingEntityFunctionalCurrency: ""
  });

  const toggleSection = (section: string) => {
    setMinimizedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const validateGeneralInfo = (): boolean => {
    const requiredFields: (keyof GeneralInfo)[] = [
      'entityId',
      'entityName',
      'costCentre',
      'exposedCurrency',
      'documentDate',
      'hedgingEntity',
      'hedgingEntityFunctionalCurrency'
    ];

    const missingFields = requiredFields.filter(field => !generalInfo[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in all required fields in General Information section: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateGeneralInfo()) {
      return;
    }

    try {
      // Create the request object conforming to the database schema
      const hedgeRequest: HedgeAccountingRequest = {
        cost_centre: generalInfo.costCentre,
        hedge_type: 'Cashflow',
        start_month: generalInfo.documentDate,
        status: 'draft',
        entity_id: generalInfo.entityId,
        entity_name: generalInfo.entityName,
        hedging_entity: generalInfo.hedgingEntity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('hedge_accounting_requests').insert(hedgeRequest);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error('Error saving hedge request:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    // Submit functionality will be implemented later
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

  return (
    <div className="max-w-[1525px] mx-auto px-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cashflow Hedge Documentation</h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <SectionHeader title="General Information" section="general" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.general ? "h-0 overflow-hidden p-0" : "")}>
          <GeneralInformationSection 
            onExposureCategoryL2Change={setSelectedExposureCategoryL2}
            onStrategyChange={(value, instrument) => {
              setSelectedStrategy(value);
              setSelectedInstrument(instrument);
            }}
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
            <HedgedItemSection 
              exposureCategoryL2={selectedExposureCategoryL2}
              selectedStrategy={selectedStrategy}
              onExposureCategoryL2Change={setSelectedExposureCategoryL2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Hedging Instrument" section="hedgingInstrument" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.hedgingInstrument ? "h-0 overflow-hidden p-0" : "")}>
          <div className="max-w-[1200px]">
            <HedgingInstrumentSection 
              selectedStrategy={selectedStrategy}
              instrumentType={selectedInstrument}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Assessment, Effectiveness, and Monitoring" section="assessment" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.assessment ? "h-0 overflow-hidden p-0" : "")}>
          <div className="max-w-[1200px]">
            <AssessmentMonitoringSection />
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
