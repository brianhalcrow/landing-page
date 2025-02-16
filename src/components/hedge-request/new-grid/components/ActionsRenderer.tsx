
import { Button } from "@/components/ui/button";
import { Plus, Copy, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { useCallback } from "react";
import { validateTradeRequest, transformTradeRequest } from "../utils/tradeRequestUtils";
import { useTradeRequestSave } from "../hooks/useTradeRequestSave";

interface ActionsRendererProps {
  data: any;
  node: any;
  api: any;
  rowIndex: number;
  onAddRow: () => void;
  updateRowData: (rowIndex: number, updates: any) => void;
  onClearGrid?: () => void;
}

export const ActionsRenderer = ({ 
  data, 
  node, 
  api, 
  rowIndex,
  onAddRow,
  updateRowData,
  onClearGrid 
}: ActionsRendererProps) => {
  const saveMutation = useTradeRequestSave();

  const handleSave = useCallback(async () => {
    try {
      const isSwap = data.instrument?.toLowerCase() === 'swap';
      
      if (isSwap) {
        // For swaps, validate and save both legs
        const isFirstLeg = rowIndex % 2 === 0;
        const otherLegIndex = isFirstLeg ? rowIndex + 1 : rowIndex - 1;
        const otherLegNode = api.getDisplayedRowAtIndex(otherLegIndex);
        
        if (!otherLegNode) {
          toast.error("Cannot save incomplete swap pair");
          return;
        }

        // Validate both legs
        const isFirstLegValid = validateTradeRequest(data);
        const isSecondLegValid = validateTradeRequest(otherLegNode.data);

        if (!isFirstLegValid || !isSecondLegValid) {
          return; // validateTradeRequest already shows error toasts
        }

        // Transform both legs for saving
        const firstLegToSave = transformTradeRequest(data);
        const secondLegToSave = transformTradeRequest(otherLegNode.data);

        // Save both legs
        await saveMutation.mutateAsync([firstLegToSave, secondLegToSave]);

        // Mark both legs as saved
        updateRowData(rowIndex, { isSaved: true });
        updateRowData(otherLegIndex, { isSaved: true });
        node.setData({ ...data, isSaved: true });
        otherLegNode.setData({ ...otherLegNode.data, isSaved: true });
        
        toast.success("Swap trade request saved successfully");
      } else {
        // For non-swaps, validate and save single row
        if (!validateTradeRequest(data)) {
          return; // validateTradeRequest already shows error toasts
        }

        // Transform and save the trade
        const tradeToSave = transformTradeRequest(data);
        await saveMutation.mutateAsync(tradeToSave);

        // Mark as saved
        updateRowData(rowIndex, { isSaved: true });
        node.setData({ ...data, isSaved: true });
        toast.success("Trade request saved successfully");
      }

      if (onClearGrid) {
        onClearGrid();
      }
    } catch (error) {
      console.error("Error saving trade request:", error);
      toast.error("Failed to save trade request");
    }
  }, [data, node, rowIndex, updateRowData, api, saveMutation, onClearGrid]);

  const handleCopy = useCallback(() => {
    const { isSaved, ...rowToCopy } = data;
    onAddRow();
    // Get the new row's data and update it with copied data
    const lastRowIndex = api.getDisplayedRowCount() - 1;
    updateRowData(lastRowIndex, rowToCopy);
    toast.success("Row copied successfully");
  }, [data, onAddRow, api, updateRowData]);

  const handleDelete = useCallback(() => {
    const isSwap = data.instrument?.toLowerCase() === 'swap';
    
    if (isSwap) {
      // For swaps, delete both legs
      const isFirstLeg = rowIndex % 2 === 0;
      const otherLegIndex = isFirstLeg ? rowIndex + 1 : rowIndex - 1;
      
      // Get both row nodes
      const currentNode = api.getDisplayedRowAtIndex(rowIndex);
      const otherNode = api.getDisplayedRowAtIndex(otherLegIndex);
      
      if (currentNode && otherNode) {
        api.applyTransaction({
          remove: [currentNode.data, otherNode.data]
        });
        toast.success("Swap pair deleted successfully");
      } else {
        toast.error("Unable to delete swap pair");
        console.error("One or both swap legs not found for deletion");
      }
    } else {
      // For non-swaps, delete single row
      const rowNode = api.getDisplayedRowAtIndex(rowIndex);
      if (rowNode) {
        api.applyTransaction({
          remove: [rowNode.data]
        });
        toast.success("Row deleted successfully");
      } else {
        toast.error("Unable to delete row");
        console.error("Row not found for deletion");
      }
    }
  }, [api, rowIndex, data]);

  const handleAddBelow = useCallback(() => {
    // Only allow adding rows at the end
    const totalRows = api.getDisplayedRowCount();
    const isLastRow = rowIndex === totalRows - 1;
    
    if (!isLastRow) {
      toast.error("New rows can only be added at the end");
      return;
    }

    onAddRow();
  }, [api, rowIndex, onAddRow]);

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleAddBelow}
        className="h-8 w-8"
        disabled={data.isSaved || rowIndex !== api.getDisplayedRowCount() - 1}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleCopy}
        className="h-8 w-8"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleSave}
        className="h-8 w-8"
        disabled={data.isSaved || saveMutation.isPending}
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleDelete}
        className="h-8 w-8"
        disabled={data.isSaved}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
