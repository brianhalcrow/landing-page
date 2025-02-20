import React from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";

const FxTradingContainer = () => {
  const [tradeDate, setTradeDate] = React.useState<Date | undefined>(new Date());
  const [settlementDate, setSettlementDate] = React.useState<Date | undefined>(new Date());
  const [direction, setDirection] = React.useState("buy");

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
        <section className="xl:col-span-12">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Trade Details</h3>
              <span className="text-sm text-muted-foreground">Required</span>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-4">
                {/* Trade Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">Trade Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {tradeDate ? format(tradeDate, "dd/MM/yyyy") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={tradeDate}
                        onSelect={setTradeDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Currency Pair */}
                <div>
                  <label className="block text-sm font-medium mb-1">CCY Pair</label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select pair" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eurusd">EUR/USD</SelectItem>
                      <SelectItem value="gbpusd">GBP/USD</SelectItem>
                      <SelectItem value="usdjpy">USD/JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Direction */}
                <div>
                  <label className="block text-sm font-medium mb-1">Direction</label>
                  <ToggleGroup
                    type="single"
                    value={direction}
                    onValueChange={(value) => value && setDirection(value)}
                    className="justify-start h-9"
                  >
                    <ToggleGroupItem value="buy" className="flex-1">
                      Buy
                    </ToggleGroupItem>
                    <ToggleGroupItem value="sell" className="flex-1">
                      Sell
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium mb-1">CCY</label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <Input type="number" className="h-9" placeholder="0.00" />
                </div>

                {/* Tenor */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tenor</label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spot">SPOT</SelectItem>
                      <SelectItem value="1w">1W</SelectItem>
                      <SelectItem value="1m">1M</SelectItem>
                      <SelectItem value="3m">3M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Settlement Date */}
                <div>
                  <label className="block text-sm font-medium mb-1">Settlement Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {settlementDate ? format(settlementDate, "dd/MM/yyyy") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={settlementDate}
                        onSelect={setSettlementDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
