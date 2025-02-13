// SpotRatesStreaming.tsx

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import CurrencyCard from "./CurrencyCard";
import useTiingoSpotRates from "./SpotRatesWs"; // Hook for streaming data

interface SpotRate {
  type: string;
  symbol: string;
  timestamp: string;
  bidSize: number;
  bidPrice: number;
  midPrice: number;
  askSize: number;
  askPrice: number;
}

const SpotRatesStreaming = ({ baseCurrency }) => {
  const [spotRates, setSpotRates] = useState<Record<string, SpotRate>>({});
  const newRate = useTiingoSpotRates(baseCurrency);

  // Update spotRates when a new rate is received
  useEffect(() => {
    if (newRate && Array.isArray(newRate.data)) {
      const [
        type,
        symbol,
        timestamp,
        bidSize,
        bidPrice,
        midPrice,
        askSize,
        askPrice,
      ] = newRate.data;

      console.log("Updating spotRates with:", { symbol, bidPrice, askPrice });

      setSpotRates((prevRates) => ({
        ...prevRates,
        [symbol]: {
          type,
          symbol,
          timestamp,
          bidSize: Number(bidSize),
          bidPrice: Number(bidPrice),
          midPrice: Number(midPrice),
          askSize: Number(askSize),
          askPrice: Number(askPrice),
        },
      }));
    }
  }, [newRate]);

  console.log("SpotRates:", spotRates);

  return (
      <Grid2
        container
        spacing={0}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4px",
          maxWidth: "1240px",
          justifyItems: "center",
        }}
      >
        {Object.entries(spotRates).map(([currencyPair, data]) => (
            <CurrencyCard
              key={currencyPair}
              symbol={data.symbol.toUpperCase()}
              bid={data.bidPrice}
              ask={data.askPrice}
              mid={data.midPrice}
              bidSize={data.bidSize}
              askSize={data.askSize}
              date={data.timestamp}
            />
        ))}
      </Grid2>
  );
};

export default SpotRatesStreaming;

