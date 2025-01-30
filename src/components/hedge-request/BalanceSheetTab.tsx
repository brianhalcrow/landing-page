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

interface BalanceSheetData {
  id: string;
  entity_id: string;
  entity_name: string;
  currency: string;
  amount: number;
  type: string;
  created_at: string;
}

const BalanceSheetTab = () => {
  const [data, setData] = useState<BalanceSheetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // For now, we'll fetch from the hedge request table as an example
        const { data: hedgeRequests, error } = await supabase
          .from("pre_trade_sfx_hedge_request")
          .select("*")
          .eq("strategy", "Balance Sheet");

        if (error) throw error;

        const formattedData = hedgeRequests.map((item: any) => ({
          id: item.trade_request_id,
          entity_id: item.entity_id,
          entity_name: item.entity_name,
          currency: item.currency_pair,
          amount: item.buy_sell_amount,
          type: item.buy_sell,
          created_at: new Date(item.trade_date).toLocaleDateString(),
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching balance sheet data:", error);
        toast.error("Failed to fetch balance sheet data");
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
              <TableHead>Entity ID</TableHead>
              <TableHead>Entity Name</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.entity_id}</TableCell>
                <TableCell>{row.entity_name}</TableCell>
                <TableCell>{row.currency}</TableCell>
                <TableCell className="text-right">
                  {row.amount?.toLocaleString()}
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BalanceSheetTab;