import {
  FileSearch,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Database,
  FileText,
} from "lucide-react";

const steps = [
  {
    title: "Pre-Trade Analysis",
    description:
      "Identify and validate currency exposures using historical data and ML techniques",
    icon: FileSearch,
  },
  {
    title: "Strategy Formulation",
    description:
      "Develop optimal hedging strategies based on risk appetite and market conditions",
    icon: LineChart,
  },
  {
    title: "Trade Execution",
    description:
      "Execute trades through integrated multi-bank platform with FIX engine capabilities",
    icon: ArrowRight,
  },
  {
    title: "Post-Trade Processing",
    description: "Automated confirmation and settlement via SWIFT MT messaging",
    icon: CheckCircle2,
  },
  {
    title: "System Integration",
    description:
      "Seamless connection with ERP/TMS systems and multi-bank connectivity",
    icon: Database,
  },
  {
    title: "Compliance & Reporting",
    description:
      "Automated hedge accounting documentation and effectiveness assessment",
    icon: FileText,
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="py-24 bg-[#f8f9fa]">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-6xl font-normal tracking-tight text-[#1e1e1c] sm:leading-tight">
            End-to-End Currency Risk Management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A streamlined process that transforms complex currency management
            into simple, automated workflows
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative p-6 bg-white rounded-lg shadow-sm border"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="absolute -bottom-4 -right-4 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
