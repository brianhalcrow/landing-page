import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function Blog() {
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
              Blog
            </CardTitle>
            <p className="text-base text-gray-600 text-center mb-8">
              Coming soon - Insights and updates about currency risk management,
              AI technology, and financial automation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
