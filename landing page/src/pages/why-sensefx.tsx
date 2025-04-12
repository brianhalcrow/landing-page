import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function WhySenseFX() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center py-12">
      <Card className="w-[600px] bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/sensefx-logo.svg"
              alt="SenseFX Logo"
              className="h-16 w-auto mb-4"
            />
            <CardTitle className="text-2xl font-semibold text-center mb-4">
              Why Choose SenseFX
            </CardTitle>
            <p className="text-base text-gray-600 text-center mb-8">
              We combine cutting-edge AI technology with deep financial
              expertise to deliver innovative solutions that transform how
              businesses manage currency risk.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
