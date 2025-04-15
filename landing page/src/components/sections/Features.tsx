import { Button } from "@/components/ui/button";

/* Original features code preserved for reference
const features = [
  {
    tag: "Pre-Trade",
    image: "/images/pre-trade.svg",
    title: "Manage everyday business finances",
    description:
      "Unlimited free wires, ACH, and cards empower CFOs to operate their business with confidence.",
    bgColor: "bg-[#e0e8f0]",
    tagColor: "bg-[#d1dce8] text-[#1d3a5d]",
  },
  {
    tag: "Trade",
    image: "/images/trade.svg",
    title: "Unlock competitive yield with Treasury",
    description:
      "Invest in Money Market Funds and Treasury Bills that earn up to 4.57% net yield.",
    bgColor: "bg-[#e5e3df]",
    tagColor: "bg-[#dbd7d0] text-[#5d3a1d]",
  },
  {
    tag: "Post-Trade",
    image: "/images/post-trade.svg",
    title: "Outsource your debt raise",
    description:
      "Leverage Arc to find and negotiate a customized debt solution on your behalf.",
    bgColor: "bg-[#dfe5e3]",
    tagColor: "bg-[#d0dbd7] text-[#1d5d3a]",
  },
];
*/

const newFeatures = [
  {
    icon: "database",
    title: "Pre-Trade",
    description:
      "Our Exposure Configuration Assistant captures and validates exposures across all your data sources",
  },
  {
    icon: "chart",
    title: "Trade",
    description:
      "Choose the links that you care about in our Semantics Editor and incorporate your enterprise knowledge.",
  },
  {
    icon: "document",
    title: "Post-Trade",
    description:
      "Query your tabular data with a Semantic Query Language designed to improve LLMs accuracy and power data apps.",
  },
];

export function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {newFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[#f3f3f3]">
                {feature.icon === "database" && (
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 5C4 3.89543 7.58172 3 12 3C16.4183 3 20 3.89543 20 5V19C20 20.1046 16.4183 21 12 21C7.58172 21 4 20.1046 4 19V5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 12C4 13.1046 7.58172 14 12 14C16.4183 14 20 13.1046 20 12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 8C4 9.10457 7.58172 10 12 10C16.4183 10 20 9.10457 20 8"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M4 16C4 17.1046 7.58172 18 12 18C16.4183 18 20 17.1046 20 16"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
                {feature.icon === "chart" && (
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3V21H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 14L11 10L15 14L21 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 8V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 8H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                {feature.icon === "document" && (
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 7H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 12H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 17H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1e1e1c]">
                {feature.title}
              </h3>
              <p className="text-[#3b5a82]/80 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
