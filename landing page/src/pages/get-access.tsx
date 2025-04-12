import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function GetAccess() {
  const handleApplyClick = () => {
    window.open("https://app.youform.com/forms/1eghcurt", "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] pt-24 pb-12">
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
    </div>
  );
}
