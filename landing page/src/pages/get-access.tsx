import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function GetAccess() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center py-12">
      <Card className="w-[600px]">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/sensefx-logo.svg"
              alt="SenseFX Logo"
              className="h-16 w-auto mb-4"
            />
            <CardTitle className="text-2xl font-semibold text-center mb-4">
              Join the SenseFX Waiting List
            </CardTitle>
            <p className="text-base text-gray-600 text-center mb-8">
              Be among the first to experience the future of automated currency
              risk management. Fill out our form to join the waiting list and
              get early access to SenseFX.
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link to="https://youform.io/your-form-url" target="_blank">
                Apply Now
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
