import {
  CheckCircle2,
  Database,
  Search,
  Settings2,
  BarChart3,
} from "lucide-react";
import erpIcon from "@/assets/images/erp-1.svg";
import tmsIcon from "@/assets/images/tms-1.svg";
import React from "react";

const steps = [
  {
    step: "Step 1",
    title: "Ingest",
    icon: Database,
    textSide: "left",
    description:
      "Connect your data sources to automatically ingest currency exposures across your business. Our smart extraction eliminates manual data collection and spreadsheet management.",
    benefits: [
      "Automatic detection from multiple systems (ERP, TMS, spreadsheets)",
      "Smart classification of exposure types and time horizons",
      "No more manual data collection or reconciliation",
    ],
    visualization:
      "[A network diagram showing]: Icons for ERP, TMS, and Excel files at the top, flows connecting to a central 'Exposure Configuration' node, labeled connections for 'Payables', 'Receivables', 'Forecasted sales', data transformation visualization.",
  },
  {
    step: "Step 2",
    title: "Configure",
    icon: Settings2,
    textSide: "right",
    description:
      "Configure policy-driven hedging strategies and approval workflows. Optimize your hedge ratio and timing based on your risk policy and market conditions.",
    benefits: [
      "Policy-driven hedging recommendations",
      "One-click execution approval",
      "Seamless integration with trading platforms",
    ],
    visualization:
      "[A flow diagram showing]: Hedge recommendation details, approval workflow, connection to trade execution, visual confirmation of hedge position.",
  },
  {
    step: "Step 3",
    title: "Validate",
    icon: Search,
    textSide: "left",
    description:
      "Automatically validate and consolidate exposures, identifying natural offsets and net positions. The platform provides real-time risk assessment and recommended hedging strategies.",
    benefits: [
      "Unified view of all currency exposures",
      "Automatic netting across business units",
      "AI-powered hedging recommendations",
    ],
    visualization:
      "[A network diagram showing]: Multiple currency pairs (EUR/USD, GBP/USD, etc.), flows connecting to risk metrics, visual representation of net exposure calculation, hedging recommendation outputs.",
  },
  {
    step: "Step 4",
    title: "Plan",
    icon: BarChart3,
    textSide: "right",
    description:
      "Forecast exposures and outcomes with real-time analytics and reporting. Gain complete visibility and make data-driven decisions for your currency risk management.",
    benefits: [
      "Real-time management reporting and analytics",
      "Forecasting of exposures and outcomes",
      "Continuous improvement with actionable insights",
    ],
    visualization:
      "[A dashboard visualization]: Charts and graphs showing forecasted exposures, risk metrics, and performance analytics.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="w-full max-w-screen-2xl mx-auto px-8">
        <h2 className="text-5xl sm:text-6xl font-normal tracking-tight text-[#1e1e1c] mb-16 text-center">
          How it Works
        </h2>
        <div className="flex flex-col gap-28">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`flex flex-col md:flex-row items-center gap-16 ${
                  step.textSide === "left"
                    ? "md:flex-row"
                    : "md:flex-row-reverse"
                }`}
              >
                {/* Text Side */}
                <div className="flex-1 min-w-[320px]">
                  <div className="flex flex-col items-start mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#e0e8f0] mb-1">
                      <Icon className="w-7 h-7 text-[#206d69]" />
                    </div>
                    <div className="w-12 flex justify-center">
                      <div className="text-xs font-semibold text-[#206d69] mb-2 tracking-wide text-center">
                        {`Step ${idx + 1}`}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-semibold mb-4 text-[#1e1e1c] text-left">
                    {step.title}
                  </h3>
                  <p className="text-lg mb-6 text-[#3b5a82]/80 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[#206d69] flex-shrink-0 mt-1" />
                        <span className="text-base text-[#3b5a82]/90">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Visualization Side */}
                <div className="flex-1 flex items-center justify-center min-h-[320px]">
                  <div className="w-11/12 h-80 bg-white/60 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-base mx-auto shadow-md px-6 text-center">
                    {step.visualization}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
