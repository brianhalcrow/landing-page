import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEntities } from "@/hooks/useEntities";

interface HedgeRequestData {
  id: number;  // Changed from string to number to match database type
  entity_id: string | null;
  entity_name: string | null;
  instrument: string | null;
  strategy: string | null;
  base_currency: string | null;
  quote_currency: string | null;
  currency_pair: string | null;
  trade_date: string | null;
  settlement_date: string | null;
  buy_sell: string | null;
  buy_sell_currency_code: string | null;
  buy_sell_amount: number | null;
}

const BalanceSheetTab = () => {
  const [data, setData] = useState<HedgeRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { entities } = useEntities();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: hedgeRequests, error } = await supabase
          .from("hedge_request")
          .select("*")
          .eq("strategy", "Balance Sheet");

        if (error) {
          console.error("Error fetching hedge requests:", error);
          toast.error("Failed to fetch balance sheet hedge requests");
          return;
        }

        setData(hedgeRequests);
        console.log("Fetched hedge requests:", hedgeRequests);
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity</TableHead>
              <TableHead>Instrument</TableHead>
              <TableHead>Currency Pair</TableHead>
              <TableHead>Trade Date</TableHead>
              <TableHead>Settlement Date</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.entity_name}</TableCell>
                <TableCell>{row.instrument}</TableCell>
                <TableCell>{row.currency_pair}</TableCell>
                <TableCell>{new Date(row.trade_date || '').toLocaleDateString()}</TableCell>
                <TableCell>{new Date(row.settlement_date || '').toLocaleDateString()}</TableCell>
                <TableCell>{row.buy_sell}</TableCell>
                <TableCell className="text-right">
                  {row.buy_sell_amount?.toLocaleString()} {row.buy_sell_currency_code}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BalanceSheetTab;