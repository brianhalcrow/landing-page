
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

// Define interfaces for each section
interface GeneralInformationData {
  entity_id: string;
  entity_name: string;
  cost_centre: string;
  transaction_currency: string;
  documentation_date: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy: string;
  hedging_entity: string;
  hedging_entity_fccy: string;
  functional_currency: string;
}

interface RiskManagementData {
  risk_management_description: string;
}

interface HedgedItemData {
  hedged_item_description: string;
}

interface HedgingInstrumentData {
  instrument: string;
  forward_element_designation: string;
  currency_basis_spreads: string;
  hedging_instrument_description: string;
}

interface AssessmentMonitoringData {
  credit_risk_impact: string;
  oci_reclassification_approach: string;
  economic_relationship: string;
  discontinuation_criteria: string;
  effectiveness_testing_method: string;
  testing_frequency: string;
  assessment_details: string;
}

interface ExposureDetailsData {
  start_month: string;
  end_month: string;
}

// Main form data interface
interface HedgeAccountingRequest {
  // General Information
  entity_id: string;
  entity_name: string;
  cost_centre: string;
  transaction_currency: string;
  documentation_date: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy: string;
  hedging_entity: string;
  hedging_entity_fccy: string;
  functional_currency: string;

  // Risk Management
  risk_management_description: string;

  // Hedged Item
  hedged_item_description: string;

  // Hedging Instrument
  instrument: string;
  forward_element_designation: string;
  currency_basis_spreads: string;
  hedging_instrument_description: string;

  // Assessment & Monitoring
  credit_risk_impact: string;
  oci_reclassification_approach: string;
  economic_relationship: string;
  discontinuation_criteria: string;
  effectiveness_testing_method: string;
  testing_frequency: string;
  assessment_details: string;

  // Exposure Details
  start_month: string;
  end_month: string;

  // System fields
  status: 'draft';
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

  // State for each section
  const [generalInfo, setGeneralInfo] = useState<GeneralInformationData>({
    entity_id: "",
    entity_name: "",
    cost_centre: "",
    transaction_currency: "",
    documentation_date: "",
    exposure_category_l1: "",
    exposure_category_l2: "",
    exposure_category_l3: "",
    strategy: "",
    hedging_entity: "",
    hedging_entity_fccy: "",
    functional_currency: ""
  });

  const [riskManagement, setRiskManagement] = useState<RiskManagementData>({
    risk_management_description: ""
  });

  const [hedgedItem, setHedgedItem] = useState<HedgedItemData>({
    hedged_item_description: ""
  });

  const [hedgingInstrument, setHedgingInstrument] = useState<HedgingInstrumentData>({
    instrument: "",
    forward_element_designation: "",
    currency_basis_spreads: "",
    hedging_instrument_description: ""
  });

  const [assessmentMonitoring, setAssessmentMonitoring] = useState<AssessmentMonitoringData>({
    credit_risk_impact: "",
    oci_reclassification_approach: "",
    economic_relationship: "",
    discontinuation_criteria: "",
    effectiveness_testing_method: "",
    testing_frequency: "",
    assessment_details: ""
  });

  const [exposureDetails, setExposureDetails] = useState<ExposureDetailsData>({
    start_month: "",
    end_month: ""
  });

  const toggleSection = (section: string) => {
    setMinimizedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const validateGeneralInfo = (): boolean => {
    const requiredFields: (keyof GeneralInformationData)[] = [
      'entity_id',
      'entity_name',
      'cost_centre',
      'transaction_currency',
      'documentation_date',
      'exposure_category_l1',
      'exposure_category_l2',
      'exposure_category_l3',
      'strategy',
      'hedging_entity',
      'hedging_entity_fccy',
      'functional_currency'
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
      const hedgeRequest: HedgeAccountingRequest = {
        ...generalInfo,
        ...riskManagement,
        ...hedgedItem,
        ...hedgingInstrument,
        ...assessmentMonitoring,
        ...exposureDetails,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('hedge_accounting_requests')
        .insert(hedgeRequest);

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
            onExposureCategoryL2Change={(value) => {
              setGeneralInfo(prev => ({
                ...prev,
                exposure_category_l2: value
              }));
            }}
            onStrategyChange={(value, instrument) => {
              setGeneralInfo(prev => ({
                ...prev,
                strategy: value
              }));
              setHedgingInstrument(prev => ({
                ...prev,
                instrument
              }));
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Risk Management Objective and Strategy" section="risk" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.risk ? "h-0 overflow-hidden p-0" : "")}>
          <RiskManagementSection />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Hedged Item Details" section="hedgedItem" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.hedgedItem ? "h-0 overflow-hidden p-0" : "")}>
          <HedgedItemSection />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Hedging Instrument" section="hedgingInstrument" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.hedgingInstrument ? "h-0 overflow-hidden p-0" : "")}>
          <HedgingInstrumentSection />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionHeader title="Assessment, Effectiveness, and Monitoring" section="assessment" />
        </CardHeader>
        <CardContent className={cn("transition-all duration-300", minimizedSections.assessment ? "h-0 overflow-hidden p-0" : "")}>
          <AssessmentMonitoringSection />
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
