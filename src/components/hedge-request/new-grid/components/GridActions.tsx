
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

  const validateRows = (rows: any[]) => {
    const validationErrors: string[] = [];
    const validRows = rows.filter(row => {
      const isValid = validateTradeRequest(row);
      
      // Log validation details for debugging
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

      if (!isValid) {
        // Add specific validation messages
        if (!row.entity_id || !row.entity_name) {
          validationErrors.push("Entity information is missing");
        }
        if (!row.strategy_name) {
          validationErrors.push("Strategy is required");
        }
        if (!row.buy_currency && !row.sell_currency) {
          validationErrors.push("At least one currency is required");
        }
        if (!row.settlement_date) {
          validationErrors.push("Settlement date is required");
        }
      }
      return isValid;
    });

    return { validRows, errors: [...new Set(validationErrors)] }; // Remove duplicate errors
  };

  const handleSave = async () => {
    try {
      const { validRows, errors } = validateRows(rowData);

      console.log("Validation results:", {
        totalRows: rowData.length,
        validRowsCount: validRows.length,
        validRows,
        errors,
        allRows: rowData
      });

      if (errors.length > 0) {
        toast.error(
          <div className="space-y-2">
            <p className="font-semibold">Please fix the following issues:</p>
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        );
        return;
      }

      if (validRows.length === 0) {
        toast.error("No valid trades to save");
        return;
      }

      // Transform all rows and collect swap legs
      const tradesToSave = validRows.flatMap(row => {
        const transformedData = transformTradeRequest(row);
        return Array.isArray(transformedData) ? transformedData : [transformedData];
      });

      // Sort trades so that for swaps, leg 1 always comes before leg 2
      const sortedTrades = tradesToSave.sort((a, b) => {
        if (a.instrument === 'Swap' && b.instrument === 'Swap' && a.swap_reference === b.swap_reference) {
          return (a.leg_number || 0) - (b.leg_number || 0);
        }
        return 0;
      });

      console.log("Saving sorted trades:", sortedTrades);

      // Save all trades in a single batch
      await saveMutation.mutateAsync(sortedTrades);

      toast.success(`Successfully saved ${validRows.length} trade request(s)`);
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
