
import { Button } from "@/components/ui/button";
import { useTradeRequestSave } from "../hooks/useTradeRequestSave";
import { toast } from "sonner";
import { transformTradeRequest, validateTradeRequest } from "../utils/tradeRequestUtils";

interface GridActionsProps {
  onAddRow: () => void;
  rowData: any[];
}

export const GridActions = ({ onAddRow, rowData }: GridActionsProps) => {
  const saveMutation = useTradeRequestSave();

  const handleSave = async () => {
    try {
      // Filter out empty rows with detailed logging
      const validRows = rowData.filter(row => {
        const isValid = validateTradeRequest(row);

        console.log('Row validation:', {
          row,
          isValid,
          hasEntityId: !!row.entity_id,
          hasStrategy: !!row.strategy_name,
          hasBuyCurrency: !!row.buy_currency,
          hasBuyAmount: !!row.buy_amount,
          hasSellCurrency: !!row.sell_currency,
          hasSellAmount: !!row.sell_amount,
          hasSettlementDate: !!row.settlement_date
        });

        return isValid;
      });

      console.log("Attempting to save rows:", {
        totalRows: rowData.length,
        validRowsCount: validRows.length,
        validRows,
        allRows: rowData
      });

      if (validRows.length === 0) {
        toast.error("No valid trades to save. Please ensure each trade has: Entity, Strategy, Currency, Amount, and Settlement Date");
        return;
      }

      // Save each row, handling both single trades and swap legs
      for (const row of validRows) {
        const transformedData = transformTradeRequest(row);
        if (Array.isArray(transformedData)) {
          // For swaps, save both legs
          for (const leg of transformedData) {
            await saveMutation.mutateAsync(leg);
          }
        } else {
          // For single trades
          await saveMutation.mutateAsync(transformedData);
        }
      }

      toast.success("Trade requests saved successfully");
    } catch (error) {
      console.error("Error in save handler:", error);
      toast.error("Failed to save trade requests");
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onAddRow}>
        Add Row
      </Button>
      <Button 
        onClick={handleSave}
        disabled={saveMutation.isPending}
      >
        {saveMutation.isPending ? "Saving..." : "Save Trade Requests"}
      </Button>
    </div>
  );
};
