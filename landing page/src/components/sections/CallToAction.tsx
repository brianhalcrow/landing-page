import { Button } from "@/components/ui/button";
import { BookDemo } from "@/components/BookDemo";
import { Link } from "react-router-dom";

export function CallToAction() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your currency risk management?
          </h2>
          <p className="mt-4 text-lg">
            Join the waitlist for early access and be among the first to
            experience the future of automated currency risk management.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <BookDemo variant="outline" size="lg">
              Schedule a Demo
            </BookDemo>
            <Button size="lg" asChild>
              <Link to="/apply">Apply for Early Access</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
