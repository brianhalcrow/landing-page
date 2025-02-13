// CurrencyCard.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";

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
    <Card
      sx={{
        minWidth: 250,
        height: "auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        textAlign: "center",
        margin: "12px 0",
        padding: "16px",
      }}
    >
      <CardContent sx={{ padding: "16px" }}>
        {/* Symbol and Timestamp Row */}
        <Grid2
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #ddd",
            paddingBottom: "8px",
            marginBottom: "8px"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "#4a90e2",
              textAlign: "left",
              fontWeight: "bold",
              lineHeight: "1.5rem" }}>
            {symbol.toUpperCase()}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              textAlign: "right",
              fontWeight: "bold",
            }}
          >
            {new Date(date).toLocaleTimeString()}
          </Typography>
        </Grid2>



        {/* Bid and Ask Prices */}
        <Grid2 container spacing={2} sx={{ mb: 1, borderBottom: "1px solid #ddd" }}>
          {/* Left Column */}
          <Grid2
            xs={6}
            container
            direction="column"
            justifyContent="center"
            sx={{ padding: "0", pr: "8px" }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Bid
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                textAlign: "left",
                backgroundColor: bidColor,
                transition: "background-color 0.3s",
              }}
            >
              {bid.toFixed(5)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left"}}>
              Size: {bidSize}
            </Typography>
          </Grid2>

          {/* Right Column */}
          <Grid2
            xs={6}
            container
            direction="column"
            justifyContent="center"
            sx={{ padding: "0", pl: "8px" }}
          >
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Ask
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                textAlign: "right",
                backgroundColor: askColor,
                transition: "background-color 0.3s",
              }}
            >
              {ask.toFixed(5)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right"}}>
              Size: {askSize}
            </Typography>
          </Grid2>
        </Grid2>

        {/* Centered Column for Mid and Spread */}
        <Grid2
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3 }} // Increased margin-top for more space
        >
          <Typography variant="body2" color="text.secondary">
            Mid: {mid.toFixed(5)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#4caf87", fontWeight: "bold", mt: 1 }}>
            Spread: {spread}
          </Typography>
        </Grid2>
      </CardContent>
    </Card>


  );
};

export default CurrencyCard;
