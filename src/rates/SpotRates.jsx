import React from "react";
import { Container } from "@mui/material";
import Grid2 from '@mui/material/Grid2';
import CurrencyCard from "./CurrencyCard";

const CurrencyGrid = () => {
  // Sample data
  const currencies = [
    {
      currencyPair: "EUR/USD",
      bid: "1.0444",
      ask: "1.0445",
      low: "1.0413",
      high: "1.0454",
      change: "+0.0030",
      percentage: "+0.22",
      time: "16:06:12",
    },
    {
      currencyPair: "EUR/GBP",
      bid: "0.8444",
      ask: "0.8445",
      low: "0.8413",
      high: "0.8454",
      change: "+0.0080",
      percentage: "+0.36",
      time: "14:01:15",
    },
    {
      currencyPair: "EUR/JPY",
      bid: "160.84",
      ask: "160.85",
      low: "159.56",
      high: "161.83",
      change: "-0.0003",
      percentage: "+0.16",
      time: "14:23:11",
    },
    {
      currencyPair: "EUR/AUD",
      bid: "1.6623",
      ask: "1.6754",
      low: "1.6510",
      high: "1.68554",
      change: "+0.0230",
      percentage: "+0.21",
      time: "10:55:46",
    },
    {
      currencyPair: "EUR/CHF",
      bid: "0.9874",
      ask: "0.9885",
      low: "0.9413",
      high: "0.9994",
      change: "-0.0062",
      percentage: "+0.13",
      time: "16:45:13",
    },
    {
      currencyPair: "EUR/NOK",
      bid: "11.7654",
      ask: "12.1142",
      low: "11.6413",
      high: "12.1222",
      change: "+0.0090",
      percentage: "+0.56",
      time: "19:51:19",
    },
    {
      currencyPair: "EUR/SEK",
      bid: "11.554",
      ask: "11.642",
      low: "11.2",
      high: "11.881",
      change: "-0.010",
      percentage: "+0.98",
      time: "20:15:21",
    },
    {
      currencyPair: "EUR/DKK",
      bid: "7.454",
      ask: "7.545",
      low: "7.3413",
      high: "7.99",
      change: "+0.0023",
      percentage: "+0.46",
      time: "14:51:19",
    }
  ];

  return (
    <Container>
      <Grid2 container spacing={4} >
        {currencies.slice(0, 8).map((currency, index) => (
          <Grid2 item key={index} sx={{ minWidth: "250px" }}>
            <CurrencyCard {...currency} />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default CurrencyGrid;
