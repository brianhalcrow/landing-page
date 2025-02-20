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
import { Toggle } from "@/components/ui/toggle";

const FxTradingContainer = () => {
  const [settlementDate, setSettlementDate] = React.useState<Date | undefined>(new Date());
  const [direction, setDirection] = React.useState("buy");
  const [currencyPair, setCurrencyPair] = React.useState("");
  const [selectedCurrency, setSelectedCurrency] = React.useState("");

  const handleCurrencyPairChange = (value: string) => {
    setCurrencyPair(value);
    setSelectedCurrency(value.substring(0, 3));
  };

  const toggleCurrency = () => {
    if (currencyPair) {
      const baseCurrency = currencyPair.substring(0, 3);
      const quoteCurrency = currencyPair.substring(3, 6);
      setSelectedCurrency(selectedCurrency === baseCurrency ? quoteCurrency : baseCurrency);
    }
  };

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
        <section className="xl:col-span-12">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Trade Details</h3>
              <span className="text-sm text-muted-foreground">Required</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-11 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Entity</label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entity1">Entity 1</SelectItem>
                      <SelectItem value="entity2">Entity 2</SelectItem>
                      <SelectItem value="entity3">Entity 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Entity ID</label>
                  <Input type="text" className="h-9" placeholder="Enter ID" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cost Centre</label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cc1">Cost Centre 1</SelectItem>
                      <SelectItem value="cc2">Cost Centre 2</SelectItem>
                      <SelectItem value="cc3">Cost Centre 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-11 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Strategy</label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hedge">Hedge</SelectItem>
                      <SelectItem value="proprietary">Proprietary</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Instrument</label>
                  <Select>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spot">Spot</SelectItem>
                      <SelectItem value="forward">Forward</SelectItem>
                      <SelectItem value="swap">Swap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CCY Pair</label>
                  <Select onValueChange={handleCurrencyPairChange}>
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

                <div>
                  <label className="block text-sm font-medium mb-1">Buy/Sell</label>
                  <Toggle
                    pressed={direction === "sell"}
                    onPressedChange={(pressed) => setDirection(pressed ? "sell" : "buy")}
                    variant="outline"
                    className="w-full h-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  >
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  </Toggle>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CCY</label>
                  <Toggle
                    pressed={selectedCurrency !== currencyPair.substring(0, 3)}
                    onPressedChange={toggleCurrency}
                    variant="outline"
                    className="w-full h-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground uppercase"
                    disabled={!currencyPair}
                  >
                    {selectedCurrency || "Select Pair"}
                  </Toggle>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <Input type="number" className="h-9" placeholder="0.00" />
                </div>

                <div className="col-span-2">
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

        <section className="xl:col-span-8 space-y-6">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Execution</h3>
              <span className="text-sm text-muted-foreground">Live Rates</span>
            </div>
            <div className="p-6">
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Execution Panel (Coming in Phase 4)
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium">Bank Pricing</h3>
              <span className="text-sm text-muted-foreground">Best Execution</span>
            </div>
            <div className="p-6">
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
