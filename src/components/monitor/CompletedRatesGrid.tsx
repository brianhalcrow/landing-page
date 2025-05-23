import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FXRate {
  currency_pair: string;
  spot_rate: number;
  time: string;
  tenor: string;
  bid: number;
  ask: number;
  rate_date: string;
  all_in_bid: number;
  all_in_ask: number;
}

const CompletedRatesGrid = () => {
  const [rowData, setRowData] = useState<FXRate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        console.log('Fetching FX rates...');
        const response = await fetch('https://api.sensefx.io/pre_trade_rates');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received FX rates:', data);
        setRowData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching FX rates:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch FX rates');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return <div className="w-full text-center py-4">Loading FX rates...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full overflow-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Currency Pair</TableHead>
            <TableHead>Spot Rate</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Tenor</TableHead>
            <TableHead>Bid</TableHead>
            <TableHead>Ask</TableHead>
            <TableHead>Rate Date</TableHead>
            <TableHead>All-in Bid</TableHead>
            <TableHead>All-in Ask</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowData.map((rate, index) => (
            <TableRow key={`${rate.currency_pair}-${index}`}>
              <TableCell>{rate.currency_pair}</TableCell>
              <TableCell>{rate.spot_rate.toFixed(6)}</TableCell>
              <TableCell>{rate.time}</TableCell>
              <TableCell>{rate.tenor}</TableCell>
              <TableCell>{rate.bid.toFixed(3)}</TableCell>
              <TableCell>{rate.ask.toFixed(3)}</TableCell>
              <TableCell>{new Date(rate.rate_date).toLocaleDateString()}</TableCell>
              <TableCell>{rate.all_in_bid.toFixed(8)}</TableCell>
              <TableCell>{rate.all_in_ask.toFixed(8)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompletedRatesGrid;