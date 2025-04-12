import { Button } from "@/components/ui/button";

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

export function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl sm:text-6xl font-normal tracking-tight text-[#1e1e1c] sm:leading-tight text-center mb-16">
          Fully integrated end-to-end workflows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 ${feature.bgColor} h-full flex flex-col`}
            >
              <div className="h-32 w-32 mb-6 bg-white/50 rounded-2xl p-4">
                <img
                  src={feature.image}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <div
                className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium mb-6 w-fit ${feature.tagColor}`}
              >
                {feature.tag}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-8 flex-grow">
                {feature.description}
              </p>
              <Button
                variant="link"
                className="text-gray-900 font-medium p-0 h-auto hover:no-underline hover:text-gray-600"
              >
                Learn more
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
