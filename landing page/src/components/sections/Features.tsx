import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

// Pastel card features array
const features = [
  {
    tag: "Pre-Trade",
    image: "/images/pre-trade.svg",
    title: "Reduce manual effort and risk of errors",
    description: "",
    bullets: [
      "Exposure capture across all data sources",
      "Automated validation workflows",
      "Configure optimal hedging strategies",
      "Monitor and forecast exposures",
    ],
    bgColor: "bg-[#e0e8f0]",
    tagColor: "bg-[#d1dce8] text-[#1d3a5d]",
  },
  {
    tag: "Trade",
    image: "/images/trade.svg",
    title: "Seamless execution without leaving the platform",
    description: "",
    bullets: [
      "Integrated approval workflows",
      "Automated compliance checks",
      "One-click trade execution",
      "Multi-bank integration",
    ],
    bgColor: "bg-[#e5e3df]",
    tagColor: "bg-[#dbd7d0] text-[#5d3a1d]",
  },
  {
    tag: "Post-Trade",
    image: "/images/post-trade.svg",
    title: "Complete visibility of accounting and reporting",
    description: "",
    bullets: [
      "Confirmation and settlement automation",
      "IFRS9/ASC815 Hedge accounting",
      "Real-time management reporting and analytics",
    ],
    bgColor: "bg-[#dfe5e3]",
    tagColor: "bg-[#d0dbd7] text-[#1d5d3a]",
  },
];

// Only export the pastel card features section
export function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="w-full max-w-screen-2xl mx-auto px-8">
        <h2 className="text-5xl sm:text-6xl font-normal tracking-tight text-[#1e1e1c] mb-12 text-center">
          Modular currency management - designed around you
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-none mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-md p-8 text-left flex flex-col items-start min-h-[650px] ${feature.bgColor}`}
            >
              {/* Tag button */}
              <div
                className={`inline-block px-5 py-2 mb-6 rounded-full text-base font-bold ${feature.tagColor}`}
              >
                {feature.tag}
              </div>
              {/* Card title */}
              <h3 className="text-3xl mb-4 text-[#1e1e1c]">{feature.title}</h3>
              <p className="text-[#3b5a82]/80 leading-relaxed mb-4 text-lg">
                {feature.description}
              </p>
              <ul className="text-[#3b5a82]/80 text-lg list-disc pl-6 space-y-2 mb-4">
                {feature.bullets &&
                  feature.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
              </ul>
              {/* Placeholder for image at bottom and Learn More link */}
              <div className="w-full flex flex-col mt-auto">
                <div className="w-11/12 h-40 bg-white/60 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-base mx-auto">
                  Image Placeholder
                </div>
                <div className="flex justify-end w-full mt-4">
                  <a
                    href={`/solutions/${feature.tag.toLowerCase().replace(/ /g, "-")}`}
                    className="text-[#206d69] font-semibold cursor-pointer hover:underline"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Early Access Section
export function EarlyAccessSection() {
  const handleApplyClick = () => {
    window.open("https://app.youform.com/forms/1eghcurt", "_blank");
  };
  return (
    <section className="py-20 bg-[#f3f3f3]">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-[#1e1e1c] sm:leading-tight mb-6">
              Join Our Early Access Program
            </h1>
            <Button
              variant="outline"
              className="text-[#3b5a82] border-[#cad2de] hover:bg-[#cad2de]/10 mb-10 text-xl py-6 px-8"
            >
              Limited Early Access
            </Button>
            <p className="text-xl sm:text-2xl text-[#3b5a82]/80 mt-8 max-w-3xl mx-auto">
              We're inviting forward-thinking companies to help shape the future
              of currency hedging automation.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#1e1e1c] mb-12 text-center">
              Why Join the Program?
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-start">
                <CheckCircle2 className="w-7 h-7 mr-4 flex-shrink-0 text-primary" />
                <span className="text-xl text-[#3b5a82]/80">
                  Priority access to our team for direct support
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-7 h-7 mr-4 flex-shrink-0 text-primary" />
                <span className="text-xl text-[#3b5a82]/80">
                  Dedicated implementation specialist
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-7 h-7 mr-4 flex-shrink-0 text-primary" />
                <span className="text-xl text-[#3b5a82]/80">
                  Customized solution tailored to your needs
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-7 h-7 mr-4 flex-shrink-0 text-primary" />
                <span className="text-xl text-[#3b5a82]/80">
                  Exclusive early adopter pricing
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-7 h-7 mr-4 flex-shrink-0 text-primary" />
                <span className="text-xl text-[#3b5a82]/80">
                  Direct influence on product development
                </span>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-7 h-7 mr-4 flex-shrink-0 text-primary" />
                <span className="text-xl text-[#3b5a82]/80">
                  Guaranteed availability before wider release
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-2xl text-[#3b5a82]/80 mb-10">Ready to join?</p>
            <Button
              size="lg"
              className="px-10 py-7 text-xl font-medium"
              onClick={handleApplyClick}
            >
              + Apply now (limited spots)
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
