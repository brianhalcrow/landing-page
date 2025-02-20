
import React from "react";
import { Separator } from "@/components/ui/separator";

const FxTradingContainer = () => {
  return (
    <div className="container mx-auto p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">FX Trading</h2>
        <div className="text-sm text-muted-foreground">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      <Separator className="mb-6" />
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Trade Details Section - Left Column */}
        <section className="xl:col-span-4 space-y-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Trade Details</h3>
              <span className="text-sm text-muted-foreground">Required</span>
            </div>
            <div className="p-6">
              {/* Trade details form will go here */}
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Trade Details Form (Coming in Phase 3)
              </div>
            </div>
          </div>
        </section>

        {/* Execution Panel - Right Column Top */}
        <section className="xl:col-span-8 space-y-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Execution</h3>
              <span className="text-sm text-muted-foreground">Live Rates</span>
            </div>
            <div className="p-6">
              {/* Execution panel will go here */}
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Execution Panel (Coming in Phase 4)
              </div>
            </div>
          </div>

          {/* Bank Pricing Grid - Right Column Bottom */}
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Bank Pricing</h3>
              <span className="text-sm text-muted-foreground">Best Execution</span>
            </div>
            <div className="p-6">
              {/* Bank pricing grid will go here */}
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Bank Pricing Grid (Coming in Phase 5)
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FxTradingContainer;
