import React from "react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2 } from "lucide-react";
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
  // Add useEffect to track mounts/unmounts
  React.useEffect(() => {
    console.log("FxTradingContainer mounted");
    return () => console.log("FxTradingContainer unmounted");
  }, []);

  const [settlementDate, setSettlementDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [direction, setDirection] = React.useState("buy");
  const [currencyPair, setCurrencyPair] = React.useState("");
  const [selectedCurrency, setSelectedCurrency] = React.useState("");
  const [tenor, setTenor] = React.useState("");
  const [spread, setSpread] = React.useState("0.000139");
  const [bid, setBid] = React.useState("1.056071");
  const [ask, setAsk] = React.useState("1.056071");
  const [selectedBank, setSelectedBank] = React.useState<string>("");
  const [bankRows, setBankRows] = React.useState([{ id: 1, bank: "" }]);
  const handleCurrencyPairChange = (value: string) => {
    setCurrencyPair(value);
    setSelectedCurrency(value.substring(0, 3));
  };
  const toggleCurrency = () => {
    if (currencyPair) {
      const baseCurrency = currencyPair.substring(0, 3);
      const quoteCurrency = currencyPair.substring(3, 6);
      setSelectedCurrency(
        selectedCurrency === baseCurrency ? quoteCurrency : baseCurrency
      );
    }
  };
  const handleDateSelect = (date: Date | undefined) => {
    setSettlementDate(date);
  };

  const addBankRow = () => {
    setBankRows([...bankRows, { id: bankRows.length + 1, bank: "" }]);
  };

  const deleteRow = (id: number) => {
    setBankRows(bankRows.filter((row) => row.id !== id));
  };

  // Helper function to get currency pair parts
  const getCurrencyPairParts = () => {
    if (!currencyPair)
      return {
        base: "EUR",
        quote: "USD",
      };
    return {
      base: currencyPair.substring(0, 3),
      quote: currencyPair.substring(3, 6),
    };
  };
  return (
    <div className="container mx-auto p-6 max-w-[1600px]">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Trade Details Section */}
        <section className="xl:col-span-12">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="flex items-center justify-between p-4 border-b"></div>
            <div className="p-4 space-y-4">
              {/* Row 1: Entity, Entity ID, Cost Centre, Strategy, and Instrument */}
              <div className="grid grid-cols-11 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Entity
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Entity ID
                  </label>
                  <Input type="text" className="h-9" placeholder="Enter ID" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cost Centre
                  </label>
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

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Strategy
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Instrument
                  </label>
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
              </div>

              {/* Row 2: CCY Pair, Buy/Sell, CCY, Amount, Tenor, Settlement Date */}
              <div className="grid grid-cols-11 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    CCY Pair
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Buy/Sell
                  </label>
                  <Toggle
                    pressed={direction === "sell"}
                    onPressedChange={(pressed) =>
                      setDirection(pressed ? "sell" : "buy")
                    }
                    variant="outline"
                    className="w-full h-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  >
                    {direction === "sell" ? "Sell" : "Buy"}
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
                  <label className="block text-sm font-medium mb-1">
                    Amount
                  </label>
                  <Input type="number" className="h-9" placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tenor
                  </label>
                  <Select value={tenor} onValueChange={setTenor}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select tenor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tod">TOD</SelectItem>
                      <SelectItem value="tom">TOM</SelectItem>
                      <SelectItem value="spot">SPOT</SelectItem>
                      <SelectItem value="1w">1W</SelectItem>
                      <SelectItem value="2w">2W</SelectItem>
                      <SelectItem value="1m">1M</SelectItem>
                      <SelectItem value="2m">2M</SelectItem>
                      <SelectItem value="3m">3M</SelectItem>
                      <SelectItem value="6m">6M</SelectItem>
                      <SelectItem value="9m">9M</SelectItem>
                      <SelectItem value="1y">1Y</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1.5">
                  <label className="block text-sm font-medium mb-1">
                    Settlement Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal h-9"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {settlementDate ? (
                          format(settlementDate, "dd/MM/yyyy")
                        ) : (
                          <span>Pick date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={settlementDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Execution Section */}
        <section className="xl:col-span-12">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-[50%]"></td>{" "}
                      {/* Space for Bank column + icons */}
                      <td className="w-[8%]">
                        <div className="text-center">
                          <label className="block text-sm font-medium mb-1">
                            Bid
                          </label>
                          <div className="text-sm text-gray-500 mb-1">
                            {currencyPair
                              ? `Sell ${currencyPair
                                  .substring(0, 3)
                                  .toUpperCase()}`
                              : "Sell BASE"}
                          </div>
                          <Input
                            type="text"
                            value={bid}
                            onChange={(e) => setBid(e.target.value)}
                            className="h-9 text-right font-mono"
                          />
                        </div>
                      </td>
                      <td className="w-[8%]">
                        <div className="text-center">
                          <label className="block text-sm font-medium mb-1">
                            Spread
                          </label>
                          <div className="text-xs text-transparent mb-1">.</div>
                          <Input
                            type="text"
                            value={spread}
                            onChange={(e) => setSpread(e.target.value)}
                            className="h-9 text-right font-mono"
                            readOnly
                          />
                        </div>
                      </td>
                      <td className="w-[8%]">
                        <div className="text-center">
                          <label className="block text-sm font-medium mb-1">
                            Ask
                          </label>
                          <div className="text-sm text-gray-500 mb-1">
                            {currencyPair
                              ? `Buy ${currencyPair
                                  .substring(3, 6)
                                  .toUpperCase()}`
                              : "Buy QUOTE"}
                          </div>
                          <Input
                            type="text"
                            value={ask}
                            onChange={(e) => setAsk(e.target.value)}
                            className="h-9 text-right font-mono"
                          />
                        </div>
                      </td>
                      {/* Gap column */}
                      <td className="w-8 px-8"></td>
                      {/* Remaining space */}
                      <td className="w-[40%]"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Pricing Section */}
        <section className="xl:col-span-12">
          <div className="rounded-lg border bg-card shadow-sm">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 w-20"></th>{" "}
                      {/* Increased width for both icons */}
                      <th className="px-4 py-2 text-center font-medium w-[20%]">
                        Bank
                      </th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Spot
                      </th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Points
                      </th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Diff
                      </th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Contract
                      </th>
                      {/* Gap column */}
                      <th className="px-8 w-8"></th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Contract
                      </th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Diff
                      </th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Spot
                      </th>
                      <th className="px-4 py-2 text-center font-medium w-[8%]">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bankRows.map((row) => (
                      <tr key={row.id} className="border-b hover:bg-muted/50">
                        <td className="px-2 py-2 w-16 flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={addBankRow}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteRow(row.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                        <td className="px-1 py-2 w-28">
                          {" "}
                          <Select
                            value={selectedBank}
                            onValueChange={setSelectedBank}
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank1">Bank A</SelectItem>
                              <SelectItem value="bank2">Bank B</SelectItem>
                              <SelectItem value="bank3">Bank C</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="1.05607"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="0.00014"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="0.00002"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="1.05623"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                        {/* Gap column */}
                        <td className="px-8 w-8 border-l border-r"></td>
                        {/* Second set of columns */}
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="1.05623"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="0.00002"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="1.05607"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-2 w-[8%]">
                          <Input
                            type="text"
                            value="0.00014"
                            className="h-8 text-right font-mono"
                            readOnly
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default FxTradingContainer;
