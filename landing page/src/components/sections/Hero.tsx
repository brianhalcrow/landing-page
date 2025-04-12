import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BookDemo } from "@/components/BookDemo";
import { Link } from "react-router-dom";
import screenshot1 from "@/assets/images/1-screenshot-dashboard-summary.png";
import screenshot2 from "@/assets/images/2-screenshot-trade-request-ad-hoc.png";
import screenshot3 from "@/assets/images/3-screenshot-trade-request-cashflow.png";
import screenshot4 from "@/assets/images/4-screenshot-trade-execution-popup.png";
import screenshot5 from "@/assets/images/5-screenshot-admin-config-entity.png";

const screenshots = [
  { src: screenshot1, alt: "Dashboard Summary" },
  { src: screenshot2, alt: "Trade Request Ad Hoc" },
  { src: screenshot3, alt: "Trade Request Cashflow" },
  { src: screenshot4, alt: "Trade Execution" },
  { src: screenshot5, alt: "Admin Configuration" },
];

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-[#f3f3f3] h-[75%]" />
        <div className="absolute inset-0 bg-white top-[75%]" />
        <div className="relative px-6 pt-8 lg:px-8">
          <div className="mx-auto max-w-4xl py-8 sm:py-12">
            <div className="text-center">
              <h1 className="text-4xl font-normal tracking-tight text-[#1e1e1c] sm:text-6xl sm:leading-tight pt-4">
                Lightning fast currency hedging and analytics
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#3b5a82]/80 max-w-2xl mx-auto">
                Join SenseFX on a path to currency management optimization.
                Wherever you are on your digital journey
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" className="px-6 min-w-[140px] font-medium">
                  Get a demo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#cad2de] text-[#3b5a82] hover:bg-[#cad2de]/10 px-6 min-w-[140px] font-medium"
                  asChild
                >
                  <Link to="/get-access">+ Get access</Link>
                </Button>
              </div>
              <div className="mt-8">
                <div className="overflow-hidden max-w-[140%] w-[140%] mx-auto relative left-1/2 -translate-x-1/2 border border-gray-200 rounded-lg shadow-sm">
                  <div className="relative" style={{ paddingBottom: "56.25%" }}>
                    {screenshots.map((image, index) => (
                      <img
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                          index === currentImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
