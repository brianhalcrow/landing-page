
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const CurrencyCard = ({ symbol, bid, ask, mid, bidSize, askSize, date, ratePrecision = 10000 }) => {
  const [previousBid, setPreviousBid] = useState(null);
  const [previousAsk, setPreviousAsk] = useState(null);
  const [bidColor, setBidColor] = useState("inherit");
  const [askColor, setAskColor] = useState("inherit");

  // Calculate spread
  const spread = ((ask - bid) * ratePrecision).toFixed(2);

  // Define the colors
  const lightGreen = "#d8fbd8";
  const lightRed = "#fde3e3";

  // Update colors for price change
  useEffect(() => {
    if (previousBid !== null && previousBid !== bid) {
      setBidColor(previousBid < bid ? lightGreen : lightRed);
      setTimeout(() => setBidColor("inherit"), 1000);
    }
    if (previousAsk !== null && previousAsk !== ask) {
      setAskColor(previousAsk < ask ? lightGreen : lightRed);
      setTimeout(() => setAskColor("inherit"), 1000);
    }
    setPreviousBid(bid);
    setPreviousAsk(ask);
  }, [bid, ask, previousBid, previousAsk]);

  return (
    <Card className="min-w-[250px] h-auto border border-gray-200 rounded-lg shadow-sm text-center m-3 p-4">
      <CardHeader className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2 p-4">
        <span className="text-blue-500 text-left font-bold leading-6">
          {symbol.toUpperCase()}
        </span>
        <span className="text-gray-500 text-right font-bold text-sm">
          {new Date(date).toLocaleTimeString()}
        </span>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2 border-b border-gray-200 mb-1">
          {/* Bid Column */}
          <div className="flex flex-col justify-center p-0 pr-2">
            <span className="text-gray-500 text-sm text-center">Bid</span>
            <span 
              className="text-xl font-bold text-left transition-colors duration-300"
              style={{ backgroundColor: bidColor }}
            >
              {bid.toFixed(5)}
            </span>
            <span className="text-gray-500 text-sm text-left">
              Size: {bidSize}
            </span>
          </div>

          {/* Ask Column */}
          <div className="flex flex-col justify-center p-0 pl-2">
            <span className="text-gray-500 text-sm text-center">Ask</span>
            <span 
              className="text-xl font-bold text-right transition-colors duration-300"
              style={{ backgroundColor: askColor }}
            >
              {ask.toFixed(5)}
            </span>
            <span className="text-gray-500 text-sm text-right">
              Size: {askSize}
            </span>
          </div>
        </div>

        {/* Mid and Spread */}
        <div className="flex flex-col items-center justify-center mt-3">
          <span className="text-gray-500 text-sm">
            Mid: {mid.toFixed(5)}
          </span>
          <span className="text-emerald-600 font-bold text-sm mt-1">
            Spread: {spread}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyCard;
