
import { Button } from "@/components/ui/button";
import { useTradeRequestSave } from "../hooks/useTradeRequestSave";
import { toast } from "sonner";

interface GridActionsProps {
  onAddRow: () => void;
  rowData: any[];
}

export const GridActions = ({ onAddRow, rowData }: GridActionsProps) => {
  const saveMutation = useTradeRequestSave();

  const handleSave = async () => {
    try {
      // Filter out empty rows
      const validRows = rowData.filter(row => 
        row.entity_id && 
        row.strategy_description && 
        row.buy_currency && 
        row.sell_currency
      );

      console.log("Attempting to save rows:", {
        totalRows: rowData.length,
        validRowsCount: validRows.length,
        validRows
      });

      if (validRows.length === 0) {
        toast.error("No valid trades to save");
        return;
      }

      // Save each row
      for (const row of validRows) {
        await saveMutation.mutateAsync(row);
      }
    } catch (error) {
      console.error("Error in save handler:", error);
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
