import { Button } from "@/components/ui/button";

// Pastel card features array
const features = [
  {
    tag: "Pre-Trade",
    image: "/images/pre-trade.svg",
    title: "Eliminate manual effort and risk of errors",
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
  return (
    <section className="py-20 bg-white">
      <div className="w-full max-w-screen-lg mx-auto px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-[#1e1e1c] mb-6">
          Shape the Future of Currency Risk Management
        </h2>
        <p className="text-xl sm:text-2xl text-[#3b5a82]/80 mb-8">
          Join our exclusive early access program and be among the first to
          transform your FX operations
        </p>
        <ul className="text-lg text-left text-[#3b5a82]/80 list-disc pl-8 max-w-xl mx-auto mb-10 space-y-2">
          <li>Direct influence on product development</li>
          <li>Priority access with implementation support</li>
          <li>Exclusive early adopter pricing</li>
          <li>Limited spots available</li>
        </ul>
        <div className="flex justify-center">
          <a href="/get-access">
            <button className="bg-[#206d69] text-white text-lg font-semibold rounded-sm px-8 min-w-[170px] h-14">
              + Apply for Early Access
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
