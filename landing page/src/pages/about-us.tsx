import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function AboutUs() {
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
              About SenseFX
            </CardTitle>
            <p className="text-base text-gray-600 text-center mb-8">
              SenseFX is revolutionizing currency risk management through
              AI-driven automation. Our mission is to empower businesses with
              intelligent solutions that simplify and optimize their foreign
              exchange operations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
