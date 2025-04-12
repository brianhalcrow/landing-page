import { Button } from "@/components/ui/button";
import { BookDemo } from "@/components/BookDemo";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="py-24 bg-[#f3f3f3]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-normal tracking-tight text-[#1e1e1c] sm:leading-tight">
            Ready to transform?
          </h2>
          <p className="mt-4 text-lg text-[#3b5a82]/80">
            Join the waitlist for early access and be among the first to
            experience the future of automated currency risk management.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" className="px-6 min-w-[140px] font-medium">
              Book a demo
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
        </div>
      </div>
    </section>
  );
}
