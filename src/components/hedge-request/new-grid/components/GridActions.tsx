
import { Button } from "@/components/ui/button";
import { useTradeRequestSave } from "../hooks/useTradeRequestSave";
import { toast } from "sonner";
import { transformTradeRequest, validateTradeRequest } from "../utils/tradeRequestUtils";

interface GridActionsProps {
  onAddRow: () => void;
  rowData: any[];
  onClearGrid?: () => void;
}

export const GridActions = ({ onAddRow, rowData, onClearGrid }: GridActionsProps) => {
  const saveMutation = useTradeRequestSave();

  const validateRows = (rows: any[]) => {
    const validationErrors: string[] = [];
    let allRowsValid = true;

    // First check if all rows are valid
    rows.forEach((row, index) => {
      const isValid = validateTradeRequest(row);
      if (!isValid) {
        allRowsValid = false;
        validationErrors.push(`Row ${index + 1} has validation errors`);
      }
    });

    // Only return valid rows if ALL rows are valid
    return {
      validRows: allRowsValid ? rows : [],
      errors: [...new Set(validationErrors)]
    };
  };

  const handleSave = async () => {
    try {
      // Filter out empty rows (rows with no data entered)
      const nonEmptyRows = rowData.filter(row => 
        row.entity_id || 
        row.strategy_name || 
        row.buy_currency || 
        row.sell_currency || 
        row.buy_amount || 
        row.sell_amount
      );

      if (nonEmptyRows.length === 0) {
        toast.error("No trades to save");
        return;
      }

      const { validRows, errors } = validateRows(nonEmptyRows);

      console.log("Validation results:", {
        totalRows: nonEmptyRows.length,
        validRowsCount: validRows.length,
        validRows,
        errors,
        allRows: nonEmptyRows
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
        toast.error("All rows must be valid before saving");
        return;
      }

      // Transform all rows
      const tradesToSave = validRows.map(row => transformTradeRequest(row));

      console.log("Saving trades:", tradesToSave);

      // Save all trades in a single batch
      await saveMutation.mutateAsync(tradesToSave);

      toast.success(`Successfully saved ${validRows.length} trade request(s)`);
      
      // Clear the grid after successful save
      if (onClearGrid) {
        onClearGrid();
      }
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
