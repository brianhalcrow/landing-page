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
  trade_request_id: string;
  entity_id: string;
  entity_name: string;
  instrument: string;
  strategy: string;
  base_currency: string;
  quote_currency: string;
  currency_pair: string;
  trade_date: string;
  settlement_date: string;
  buy_sell: string;
  buy_sell_currency_code: string;
  buy_sell_amount: number;
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
              <TableRow key={row.trade_request_id}>
                <TableCell>{row.entity_name}</TableCell>
                <TableCell>{row.instrument}</TableCell>
                <TableCell>{row.currency_pair}</TableCell>
                <TableCell>{new Date(row.trade_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(row.settlement_date).toLocaleDateString()}</TableCell>
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